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

//salva as saidas e desconta do estoque
function inicializarSaidas() {
    let saidas = JSON.parse(localStorage.getItem('listaSaidas'));
    if (!saidas) {
        saidas = []; 
        localStorage.setItem('listaSaidas', JSON.stringify(saidas));
    }
    return saidas;
}

export function obterSaidas() {
    return inicializarSaidas();
}

export async function salvarSaidaNoBanco(saidaObjeto) {
    let saidas = inicializarSaidas();
    saidas.push(saidaObjeto); 
    localStorage.setItem('listaSaidas', JSON.stringify(saidas));
    
    let produtos = JSON.parse(localStorage.getItem('listaProdutos'));
    let indexProduto = produtos.findIndex(p => p.nome === saidaObjeto.produto);
    
    if (indexProduto !== -1) {
        let qtdAtual = parseInt(produtos[indexProduto].quantidade);
        let qtdSaida = parseInt(saidaObjeto.quantidade);
        produtos[indexProduto].quantidade = (qtdAtual - qtdSaida).toString();
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
    }

    return new Promise(resolve => setTimeout(resolve, 100)); 
}