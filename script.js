const form = document.getElementById("reportForm");
const reportsList = document.getElementById("reportsList");
const emptyState = document.getElementById("emptyState");
const tipoSelect = document.getElementById("tipo");
const urgentNote = document.getElementById("urgentNote");
const descricao = document.getElementById("descricao");
const charCount = document.getElementById("charCount");
const fotoInput = document.getElementById("foto");
const filePreview = document.getElementById("filePreview");
const previewImg = document.getElementById("previewImg");
const previewName = document.getElementById("previewName");
const toast = document.getElementById("toast");
const statAtivas = document.getElementById("statAtivas");
const statUrgentes = document.getElementById("statUrgentes");

const URGENT_TYPES = ["Fiação exposta", "Poste caído"];
let protocoloSeq = 3; // próximos protocolos começam em #0003
let ativas = 2;
let urgentes = 1;

// Mostra aviso de prioridade para tipos perigosos
tipoSelect.addEventListener("change", () => {
  urgentNote.classList.toggle("show", URGENT_TYPES.includes(tipoSelect.value));
});

// Contador de caracteres
descricao.addEventListener("input", () => {
  charCount.textContent = descricao.value.length;
});

// Pré-visualização de foto com validação de tamanho
fotoInput.addEventListener("change", () => {
  const file = fotoInput.files[0];
  if (!file) {
    filePreview.classList.remove("show");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast("A foto deve ter até 5MB. Escolha outro arquivo.");
    fotoInput.value = "";
    filePreview.classList.remove("show");
    return;
  }
  previewImg.src = URL.createObjectURL(file);
  previewName.textContent = file.name;
  filePreview.classList.add("show");
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function pad(n) {
  return String(n).padStart(4, "0");
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const tipo = tipoSelect.value;
  const desc = descricao.value.trim();
  const isUrgente = URGENT_TYPES.includes(tipo);

  if (!nome || !endereco || !tipo) {
    showToast("Preencha nome, endereço e tipo de problema.");
    return;
  }

  const card = document.createElement("div");
  card.className = "report" + (isUrgente ? " urgente" : "");

  const top = document.createElement("div");
  top.className = "report-top";

  const left = document.createElement("div");
  const h3 = document.createElement("h3");
  h3.textContent = endereco;
  const tipoSpan = document.createElement("span");
  tipoSpan.className = "tipo";
  tipoSpan.textContent = tipo;
  left.appendChild(h3);
  left.appendChild(tipoSpan);

  const protocolo = document.createElement("span");
  protocolo.className = "protocolo";
  protocolo.textContent = "#" + pad(protocoloSeq++);

  top.appendChild(left);
  top.appendChild(protocolo);
  card.appendChild(top);

  if (desc) {
    const p = document.createElement("p");
    p.className = "descricao";
    p.textContent = desc;
    card.appendChild(p);
  }

  const meta = document.createElement("div");
  meta.className = "meta";
  const autor = document.createElement("span");
  autor.textContent = "Reportado por: " + nome;
  const data = document.createElement("span");
  data.textContent = new Date().toLocaleDateString("pt-BR");
  meta.appendChild(autor);
  meta.appendChild(data);
  card.appendChild(meta);

  const badge = document.createElement("span");
  badge.className = "badge " + (isUrgente ? "urgente-badge" : "pendente");
  badge.textContent = isUrgente ? "Urgente" : "Pendente";
  card.appendChild(badge);

  if (fotoInput.files.length > 0 && fotoInput.files[0].size <= 5 * 1024 * 1024) {
    const img = document.createElement("img");
    img.className = "foto";
    img.src = URL.createObjectURL(fotoInput.files[0]);
    img.alt = "Foto do poste reportado em " + endereco;
    card.appendChild(img);
  }

  reportsList.prepend(card);
  emptyState.style.display = "none";

  ativas++;
  if (isUrgente) urgentes++;
  statAtivas.textContent = ativas;
  statUrgentes.textContent = urgentes;

  showToast("Ocorrência enviada com sucesso — protocolo #" + pad(protocoloSeq - 1));

  form.reset();
  charCount.textContent = "0";
  urgentNote.classList.remove("show");
  filePreview.classList.remove("show");
  card.scrollIntoView({ behavior: "smooth", block: "center" });
});
