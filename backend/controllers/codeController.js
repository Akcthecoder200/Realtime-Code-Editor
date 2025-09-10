import axios from "axios";

export const compileCode = async (code, language, version) => {
  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language,
        version,
        files: [
          {
            content: code,
          },
        ],
      }
    );
    return response.data;
  } catch (error) {
    console.error("Code compilation error:", error);
    throw error;
  }
};
