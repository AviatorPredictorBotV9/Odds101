demo.onclick = () => app.classList.remove("hidden");

submit.onclick = async () => {
  const fd = new FormData();
  fd.append("phone", phone.value);
  fd.append("method", method.value);
  fd.append("txRef", txRef.value);
  fd.append("proof", proof.files[0]);

  const res = await fetch("/upload", { method: "POST", body: fd });
  const data = await res.json();
  alert(data.status === "success" ? "Submitted" : "Error");
};
