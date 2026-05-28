const URL_API = 'http://localhost:3000/api';

// --- CATEGORIAS ---
export async function obterCategorias() {
    try {
        const res = await fetch(`${URL_API}/categorias`);
        return await res.json();
    } catch (erro) { console.error(erro); return []; }
}

export async function salvarCategoriaNoBanco(nomeCategoria) {
    await fetch(`${URL_API}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeCategoria })
    });
}

// --- FORNECEDORES ---
export async function obterFornecedores() {
    try {
        const res = await fetch(`${URL_API}/fornecedores`);
        return await res.json();
    } catch (erro) { console.error(erro); return []; }
}

export async function salvarFornecedorNoBanco(fornecedorObjeto) {
    const res = await fetch(`${URL_API}/fornecedores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fornecedorObjeto)
    });
    
    // Se o HTTP não for 200 (Sucesso), nós expomos a falha
    if (!res.ok) {
        const erro = await res.json();
        alert("O SQL SERVER RECUSOU A INSERÇÃO:\n" + erro.erro);
        throw new Error("Paralisando o script para não perder o erro no console.");
    }
}

// --- PRODUTOS ---
export async function obterProdutos() {
    try {
        const res = await fetch(`${URL_API}/produtos`);
        return await res.json();
    } catch (erro) { console.error(erro); return []; }
}

export async function salvarProdutoNoBanco(produtoObjeto) {
    await fetch(`${URL_API}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoObjeto)
    });
}

// --- SAÍDAS (Requisição real usando a sua Procedure) ---
export async function obterSaidas() {
    return []; 
}

export async function salvarSaidaNoBanco(saidaObjeto) {
    const mapaSetores = { "Administração": 1, "TI": 2, "Joao": 1, "Maria": 2 };
    
    // Precisamos buscar o produto no banco para achar o ID dele 
    const resProd = await fetch(`${URL_API}/cardapio`);
    const cardapio = await resProd.json();
    
    // O cardapio traz a string "ID - NOME"
    const produtoEncontrado = cardapio.find(p => p.Produto.includes(saidaObjeto.produto));
    if(!produtoEncontrado) {
        alert("Erro: Produto não encontrado no Banco de Dados.");
        return;
    }
    const idProdutoDB = parseInt(produtoEncontrado.Produto.split(' - ')[0]);
    const idSetorDB = mapaSetores[saidaObjeto.setor] || 1; 

    const resposta = await fetch(`${URL_API}/requisicao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idProduto: idProdutoDB,
            idSetor: idSetorDB,
            qtdProd: parseInt(saidaObjeto.quantidade),
            valorUni: 0 
        })
    });

    const dados = await resposta.json();
    if (!resposta.ok) {
        alert("BANCO DE DADOS RECUSOU:\n" + dados.mensagemErro);
        throw new Error(dados.mensagemErro);
    }
    alert("Operação autorizada!\n" + dados.mensagem);
}