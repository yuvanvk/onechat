export async function uploadToBucket(file: File) {
  try {
    const response = await fetch(`http://localhost:8787/api/v1/r2`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
      }),
    });

    if (!response.ok) throw new Error("Failed to get presigned URL");
    const { data } = await response.json();

    const uploadRes = await fetch(data.signedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadRes.ok) throw new Error("Failed to upload to R2");

    return true;
  } catch (error) {
    console.error("Upload failed", error);
    throw error;
  }
}
