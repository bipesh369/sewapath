import { useEffect } from "react";

import getServices from "./api/services.api";
import Services from "./pages/Services";

function App() {
  useEffect(() => {
    getServices()
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <Services />;
}

export default App;