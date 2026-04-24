const BASE_URL = "https://bfhl-project-ellw.onrender.com"; 

export const sendData = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/bfhl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!res.ok) throw new Error("API Error");

    return await res.json();
  } catch (error) {
    throw error;
  }
};