import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getEligibilityQuestions,
  evaluateEligibility,
} from "../api/eligibility.api";
import { createApplication } from "../api/applications.api";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

function Eligibility() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [startingGoal, setStartingGoal] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [currentOrder, setCurrentOrder] = useState(null);
  const [history, setHistory] = useState([]); // [{order, value}]
  const [result, setResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    getEligibilityQuestions(id)
      .then((res) => {
        setQuestions(res.data);
        if (res.data.length > 0) setCurrentOrder(res.data[0].order);
      })
      .catch((err) =>
        setLoadError(
          err.response?.data?.message || "Failed to load eligibility questions"
        )
      )
      .finally(() => setLoading(false));
  }, [id]);

  const questionMap = useMemo(
    () => new Map(questions.map((q) => [q.order, q])),
    [questions]
  );
  const currentQuestion = currentOrder != null ? questionMap.get(currentOrder) : null;

  const finish = async (finalAnswers) => {
    setEvaluating(true);
    setSubmitError("");
    try {
      const res = await evaluateEligibility(
        id,
        finalAnswers.map(({ order, value }) => ({ questionOrder: order, value }))
      );
      setResult(res.data);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Failed to evaluate eligibility"
      );
    } finally {
      setEvaluating(false);
    }
  };

  const selectOption = (option) => {
    const nextHistory = [...history, { order: currentQuestion.order, value: option.value }];
    setHistory(nextHistory);

    if (!option.resultsInEligible || currentQuestion.isTerminal) {
      finish(nextHistory);
      return;
    }

    if (option.nextQuestionOrder == null) {
      finish(nextHistory);
      return;
    }

    setCurrentOrder(option.nextQuestionOrder);
  };

  const startGoal = async () => {
    if (!isAuthenticated) {
      // Stash the intent and resume it right after the person logs in.
      sessionStorage.setItem(
        "sewapath_pending_application",
        JSON.stringify({ serviceId: id, reason: result.reason })
      );
      navigate("/login", { state: { from: { pathname: `/services/${id}/eligibility` } } });
      return;
    }

    setStartingGoal(true);
    setSubmitError("");
    try {
      const res = await createApplication(id, { eligible: true, reason: result.reason });
      navigate(`/applications/${res.data._id}`);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to start this goal");
      setStartingGoal(false);
    }
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = [...history];
    const last = prev.pop();
    setHistory(prev);
    setCurrentOrder(last.order);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink/60">
        Loading eligibility questions…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-clay">
        {loadError}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-660px px-6 py-16 text-center md:px-12">
        <p className="text-ink/60">
          No eligibility questions have been set up for this service yet.
        </p>
        <Button as={Link} to={`/services/${id}/journey`} className="mt-4" size="sm">
          View the typical journey instead
        </Button>
      </div>
    );
  }

  const answeredCount = history.length;

  return (
    <div className="mx-auto max-w-660px px-6 pt-11 pb-24 md:px-12">
      <div className="mb-11 flex items-center">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div className="flex h-29px w-29px items-center justify-center rounded-full border-2 border-moss bg-moss font-mono text-xs font-semibold text-white">
            ✓
          </div>
          <div className="text-[11.5px] text-ink/60">Goal</div>
        </div>
        <div className="mx-1.5 mb-22px h-0.5 flex-1 bg-moss" />
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div className="flex h-29px w-29px items-center justify-center rounded-full border-2 border-marigold bg-marigold font-mono text-xs font-semibold text-ink">
            {answeredCount + 1}
          </div>
          <div className="text-[11.5px] font-semibold whitespace-nowrap text-ink">
            {result ? "Result" : "Questions"}
          </div>
        </div>
        <div className="mx-1.5 mb-22px h-0.5 flex-1 bg-ink/15" />
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div className="flex h-29px w-29px items-center justify-center rounded-full border-2 border-ink/15 bg-paper-dim font-mono text-xs font-semibold text-ink/60">
            ✓
          </div>
          <div className="text-[11.5px] whitespace-nowrap text-ink/60">Journey</div>
        </div>
      </div>

      {!result && currentQuestion && (
        <div className="rounded-2xl border-[1.5px] border-ink/15 bg-white p-8 md:p-38px">
          <div className="mb-2.5 font-mono text-xs tracking-[0.06em] text-ink/60 uppercase">
            Question {answeredCount + 1} · {questions.length} question
            {questions.length === 1 ? "" : "s"} in this service
          </div>
          <h2 className="mb-7 text-[20px] leading-[1.3] md:text-[23px]">
            {currentQuestion.questionText.en}
          </h2>

          <div className="mb-34px flex flex-col gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectOption(option)}
                disabled={evaluating}
                className="flex items-center gap-3.5 rounded-[10px] border-[1.5px] border-ink/15 px-17px py-15px text-left text-[15px] font-medium transition-colors hover:border-marigold disabled:opacity-60"
              >
                <span className="h-18px w-18px shrink-0 rounded-full border-2 border-ink/40" />
                {option.label.en}
              </button>
            ))}
          </div>

          {submitError && <p className="mb-4 text-sm text-clay">{submitError}</p>}

          <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[12.5px] text-ink/60">
              Your answers are never shared without your permission.
            </span>
            <div className="flex gap-2.5">
              <Button variant="ghost" size="sm" onClick={goBack} disabled={history.length === 0}>
                Back
              </Button>
              {evaluating && <Button size="sm" disabled>Checking…</Button>}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div
          className={`rounded-2xl border-[1.5px] p-8 md:p-38px ${
            result.eligible ? "border-moss bg-moss-bg" : "border-clay bg-clay-bg"
          }`}
        >
          <div
            className={`mb-2.5 font-mono text-xs tracking-[0.06em] uppercase ${
              result.eligible ? "text-moss" : "text-clay"
            }`}
          >
            {result.eligible ? "You qualify" : "Not eligible right now"}
          </div>
          <h2 className="mb-4 text-[23px]">
            {result.eligible ? "You're eligible for this service" : "You don't meet the requirements"}
          </h2>
          <p className="mb-4 text-[15px] leading-[1.6] text-ink-light">{result.reason}</p>

          {submitError && <p className="mb-4 text-sm text-clay">{submitError}</p>}

          <div className="flex flex-wrap gap-2.5">
            {result.eligible ? (
              <>
                <Button size="sm" onClick={startGoal} disabled={startingGoal}>
                  {startingGoal
                    ? "Starting…"
                    : isAuthenticated
                    ? "Start this as a goal"
                    : "Log in to start this goal"}
                </Button>
                <Button as={Link} to={`/services/${id}/journey`} variant="ghost" size="sm">
                  Preview the typical journey
                </Button>
              </>
            ) : (
              <Button as={Link} to="/services" size="sm">
                Browse other services
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={goBack}>
              Change my answers
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Eligibility;
