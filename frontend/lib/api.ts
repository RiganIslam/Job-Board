const API_URL = "http://localhost:5000/api";

async function request(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function getJobs() {
  return request(`${API_URL}/jobs`);
}

export async function getCategories() {
  return request(`${API_URL}/categories`);
}

export async function getStats() {
  return request(`${API_URL}/stats`);
}

export async function getJob(id: string) {
  return request(`${API_URL}/jobs/${id}`);
}