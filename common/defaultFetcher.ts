export const defaultFetcher = async (url: string) => {
  const response = await fetch(url, {
    redirect: "manual",
  });

  if (response.headers.get("Location")) {
    (window as any).location = response.headers.get("Location");
  }

  if (response.ok) {
    return response.json();
  } else {
    console.error(response);
    throw new Error(response.statusText);
  }
};
