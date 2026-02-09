//Elementos
const addtarefa = document.querySelector("#addtarefa");
const btnaddtarefa = document.querySelector("#btnaddtarefa");
const lista = document.querySelector("#lista");
//const listabtn = document.querySelector(".container-button")
//const del = document.querySelector(".del");

const selecao = document.querySelector("#selecao");

const modal = document.getElementById("modal");
const btnCancelar = document.getElementById("btnCancelar");
const btnSalvar = document.querySelector("#btnSalvar");
const inputEditar = document.querySelector("#inputEditar");

const inputpesquisa = document.querySelector("#inputpesquisa");
const btnpesquisa = document.querySelector("#btnpesquisa");

//Functions

criarTarefa = (texto, id) => {
  const template = `
        <div class="tarefa-lista" id="div_${id}">
            <p id="nome_${id}">${texto}</p>
            <div class="container-button">
                <button class="check" id ="${id}" type="button"><i class="fa-solid fa-check"></i></button>
                <button class="alt" id ="${id}" type="button"><i class="fa-solid fa-pen"></i></button>
                <button class="del" id="${id}" type="button"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>
        `;
  const parse = new DOMParser();
  templateHtml = parse.parseFromString(template, "text/html");
  const tarefaLista = templateHtml.querySelector(".tarefa-lista");
  lista.appendChild(tarefaLista);
};

postTarefa = async () => {
  const texto = addtarefa.value;
  if (!texto) return;
  try {
    await axios.post("http://localhost:3000/tarefas", {
      tarefa: texto,
    });
  } catch (error) {
    console.log(error);
  }
  lista.innerHTML="";
  persistirTarefa();
  addtarefa.value="";
};

getTarefa = () => {
  try {
    const response = axios.get("http://localhost:3000/tarefas");
    return response;
  } catch (error) {
    console.log(error);
  }
};

persistirTarefa = () => {
  const response = getTarefa();
  response
    .then((res) => res.data)
    .then((res) => {
      //console.log(res)
      res.forEach((element) => {
        criarTarefa(element.tarefa, element.id);
      });
    });
};
persistirTarefa();

deletarTarefa = (id) => {
  try {
    axios.delete(`http://localhost:3000/tarefas/${id}`);
  } catch (error) {
    console.log(error);
  }
};

//alterar
let idEditar = null;
abrirModal = (id) => {
  idEditar = id;
  modal.style.display = "flex";
};
btnSalvar.addEventListener("click", (e) => {
  e.preventDefault();
  //console.log(id)
  const texto = inputEditar.value;
  if (!texto) return;

  patchTarefa(idEditar, texto);
  fecharModal();
});
fecharModal = () => {
  modal.style.display = "none";
};

patchTarefa = (id, texto) => {
  axios.patch(`http://localhost:3000/tarefas/${id}`, {
    tarefa: texto,
  });
};

//check
check = (id) => {
  const item = document.getElementById(`div_${id}`);
  //item.style.opacity = item.style.opacity === "0.5" ? "1" : "0.5";
  item.classList.toggle("done");
};

//Pesquisar
pesquisar = () => {
  const listaTarefas = document.querySelectorAll(".tarefa-lista");
  const texto = inputpesquisa.value.toLowerCase();

  //EDIT :nao chamar a api, consuma do DOM
  getTarefa()
    .then((res) => res.data)
    .then((tarefas) => {
      tarefas.forEach((objeto) => {
        const divTarefa = document.querySelector(`#div_${objeto.id}`);
        if (!texto) {
          listaTarefas.forEach((e) => {
            e.classList.remove("hide");
            return;
          });
        }
        if (objeto.tarefa.toLowerCase().includes(texto)) {
          divTarefa.classList.remove("hide");
        } else {
          divTarefa.classList.add("hide");
        }
      });
    });
};

//Filtrar
filterTodos = (filterValue) => {
  const listaTarefas = document.querySelectorAll(".tarefa-lista");

  switch (filterValue) {
    case "todos":
      listaTarefas.forEach((e) => {
        e.classList.remove("hide");
      });
      break;

    case "feito":
      listaTarefas.forEach((e) => {
        if (!e.classList.contains("done")) {
          e.classList.add("hide");
        } else {
          e.classList.remove("hide");
        }
      });
      break;

    case "fazer":
      listaTarefas.forEach((e) => {
        if (e.classList.contains("done")) {
          e.classList.add("hide");
        } else {
          e.classList.remove("hide");
        }
      });
      break;
  }
};

//Events
inputpesquisa.addEventListener("input", () => {
  pesquisar();
});

btnpesquisa.addEventListener("click", () => {
  inputpesquisa.value = "";
  pesquisar();
});

selecao.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

btnaddtarefa.addEventListener("click", (e) => {
  e.preventDefault();
  //criarTarefa();
  postTarefa();
});

lista.addEventListener("click", (e) => {
  e.preventDefault();
  const botao = e.target.closest("button");
  const id = botao.id;

  if (!botao) return;

  if (botao.classList.contains("check")) {
    check(id);
  } else if (botao.classList.contains("alt")) {
    const p = document.querySelector(`#nome_${id}`);
    console.log(p.textContent)
    inputEditar.value = p.textContent;
    abrirModal(id);
  } else if (botao.classList.contains("del")) {
    deletarTarefa(id);
  }
});

btnCancelar.addEventListener("click", (e) => {
  e.preventDefault();
  fecharModal();
});
