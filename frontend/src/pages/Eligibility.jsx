import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getEligibilityQuestions,
  evaluateEligibility,
} from "../api/eligibility.api";

function Eligibility() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getEligibilityQuestions(id);
        setQuestions(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load eligibility questions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleAnswer = (questionOrder, value) => {
    setAnswers((previous) => ({
      ...previous,
      [questionOrder]: value,
    }));

    setResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedAnswers = Object.entries(answers).map(
      ([questionOrder, value]) => ({
        questionOrder: Number(questionOrder),
        value,
      })
    );

    try {
      setSubmitting(true);
      setError("");

      const response = await evaluateEligibility(
        id,
        formattedAnswers
      );

      setResult(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to evaluate eligibility"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">
          Loading eligibility questions...
        </p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-gray-600">
          No eligibility questions available.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">

        <h1 className="text-3xl font-bold text-gray-900">
          Check Your Eligibility
        </h1>

        <p className="mt-2 text-gray-600">
          Answer the following questions to find out if
          you're eligible.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          {questions.map((question) => (
            <div
              key={question._id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <h2 className="font-semibold text-gray-900">
                {question.order}.{" "}
                {question.questionText.en}
              </h2>

              <div className="mt-4 space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={`question-${question.order}`}
                      value={option.value}
                      checked={
                        answers[question.order] ===
                        option.value
                      }
                      onChange={() =>
                        handleAnswer(
                          question.order,
                          option.value
                        )
                      }
                    />

                    <span className="text-gray-700">
                      {option.label?.en || option.value}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting
              ? "Checking..."
              : "Check Eligibility"}
          </button>
        </form>

        {result && (
          <div
            className={`mt-8 rounded-xl p-6 ${
              result.eligible
                ? "bg-green-50"
                : "bg-red-50"
            }`}
          >
            <h2 className="text-xl font-bold">
              {result.eligible
                ? "You are eligible"
                : "You are not eligible"}
            </h2>

            <p className="mt-2 text-gray-700">
              {result.reason}
            </p>
          </div>
        )}

      </div>
    </main>
  );
}

export default Eligibility;