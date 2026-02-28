import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function App() {
  const [result, setResult] = useState<string>("");
  const [ingredients, setIngredients] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function sendQuery(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const { data, errors } = await client.queries.askBedrock({
        ingredients: ingredients.split(",").map((s) => s.trim()),
      });

      if (errors) {
        setResult("Error: " + errors.map((e) => e.message).join(", "));
      } else {
        setResult(data?.body ?? "No recipe generated.");
      }
    } catch (err) {
      setResult("Unexpected error: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <div className="header-container">
        <h1 className="main-header">
          Meet Your Personal{" "}
          <span className="highlight">Recipe Generator</span>
        </h1>
        <p className="description">
          Simply type a few ingredients using the format ingredient1,
          ingredient2, etc., and recipe generator will suggest an all-new
          recipe for you.
        </p>
      </div>

      <form onSubmit={sendQuery} className="form-container">
        <div className="search-container">
          <input
            className="wide-input"
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ingredient1, Ingredient2, Ingredient3,...etc"
          />
          <button type="submit" className="search-button">
            Generate
          </button>
        </div>
      </form>

      <div className="result-container">
        {loading ? (
          <div className="loader-container">
            <p>Loading...</p>
            <Loader size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
            <Placeholder size="large" />
          </div>
        ) : (
          result && <p className="result">{result}</p>
        )}
      </div>
    </div>
  );
}
