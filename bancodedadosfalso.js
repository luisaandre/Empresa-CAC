//para adicionar categorias

function inicializarCategorias() {
    let categorias = JSON.parse(localStorage.getItem('listaCategorias'));
    if (!categorias) {
        categorias = []; 
        localStorage.setItem('listaCategorias', JSON.stringify(categorias));
    }
    return categorias;
}

export function obterCategorias() {
    return inicializarCategorias();
}

export async function salvarCategoriaNoBanco(nomeCategoria) {
    let categorias = inicializarCategorias();
    
    if (!categorias.includes(nomeCategoria)) {
        categorias.push(nomeCategoria);
        localStorage.setItem('listaCategorias', JSON.stringify(categorias));
        console.log(`[API MOCK] Categoria "${nomeCategoria}" salva com sucesso!`);
    }
    
    return new Promise(resolve => setTimeout(resolve, 0)); 
}




//para adicionar fornecedor

function inicializarFornecedores() {
    let fornecedores = JSON.parse(localStorage.getItem('listaFornecedores'));
    if (!fornecedores) {
        fornecedores = [];
        localStorage.setItem('listaFornecedores', JSON.stringify(fornecedores));
    }
    return fornecedores;
}

export function obterFornecedores() {
    return inicializarFornecedores();
}

export async function salvarFornecedorNoBanco(fornecedorObjeto) {
    let fornecedores = inicializarFornecedores();
    
    fornecedores.push(fornecedorObjeto);
    localStorage.setItem('listaFornecedores', JSON.stringify(fornecedores));
    
    console.log(`[API MOCK] Fornecedor "${fornecedorObjeto.nomeFantasia}" salvo com sucesso!`);
    
    return new Promise(resolve => setTimeout(resolve, 0));
}

//adicionar produtos no estoque
function inicializarProdutos() {
    let produtos = JSON.parse(localStorage.getItem('listaProdutos'));
    
    if (!produtos) {
        produtos = []; 
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
    }
    return produtos;
}

export function obterProdutos() {
    return inicializarProdutos();
}

export async function salvarProdutoNoBanco(produtoObjeto) {
    let produtos = inicializarProdutos();
    produtos.push(produtoObjeto); 
    localStorage.setItem('listaProdutos', JSON.stringify(produtos));
    return new Promise(resolve => setTimeout(resolve, 0)); 
}