import { obterCategorias, salvarCategoriaNoBanco, obterFornecedores, salvarFornecedorNoBanco, obterProdutos, salvarProdutoNoBanco, obterSaidas, salvarSaidaNoBanco } from './bancodedadosfalso.js';

//perfil
const botaoPerfil = document.querySelector('.troca-perfil');
const menuContent = document.querySelector('.outro-perfil');

botaoPerfil.addEventListener('click', function(event) {
    event.stopPropagation(); 
    menuContent.classList.toggle('aberto');
    botaoPerfil.classList.toggle('ativo'); 
});

document.addEventListener('click', function(event) {
    if (!menuContent.contains(event.target) && !botaoPerfil.contains(event.target)) {
        menuContent.classList.remove('aberto');
        botaoPerfil.classList.remove('ativo');
    }
});

menuContent.addEventListener('click', function(event) {
    const linkClicado = event.target.closest('a');
    
    if (linkClicado) {
        const nomeUsuario = linkClicado.querySelector('#usuario').textContent.trim();
        
        let claimAtivo = nomeUsuario.includes("Maria") ? "Maria" : "Joao";
        localStorage.setItem('perfilAtivo', claimAtivo);
        
        return true; 
    }
});

//barra lateral
    const urlAtual = window.location.pathname; 
const textoEstoque = document.querySelector('.estoque');
const textoHistorico = document.querySelector('.historico');
const textoProdutos = document.querySelector('.produtos');
const textoFornecedores = document.querySelector('.fornec');
const menuEstoqueNav = document.querySelector('.estoque-contain');
const menuHistoricoNav = document.querySelector('.historico-contain');
const setaPedidosNav = document.querySelector('#seta-pedidos');

if (textoEstoque && textoHistorico) {
    if (urlAtual.includes('historico')) {
        textoHistorico.classList.add('menu-ativo');
    } 
    else if (urlAtual.includes('estoque') || urlAtual.includes('cadastrar-produto')) {
        textoEstoque.classList.add('menu-ativo');
    }
}

if (textoProdutos && textoFornecedores) {
    if (urlAtual.includes('fornecedor')) {
        textoFornecedores.classList.add('menu-principal-ativo');
        
        if (menuEstoqueNav && menuHistoricoNav && setaPedidosNav) {
            menuEstoqueNav.classList.add('oculto');
            menuHistoricoNav.classList.add('oculto');
            setaPedidosNav.classList.add('fechado');
        }
    } 
    else if (
        urlAtual.includes('estoque') || 
        urlAtual.includes('historico') || 
        urlAtual.includes('cadastrar-produto')
    ) {
        textoProdutos.classList.add('menu-principal-ativo');
        
        if (menuEstoqueNav && menuHistoricoNav && setaPedidosNav) {
            menuEstoqueNav.classList.remove('oculto');
            menuHistoricoNav.classList.remove('oculto');
            setaPedidosNav.classList.remove('fechado');
        }
    }
}


//produto
const botaoProdutos = document.querySelector('.produto-row');
const menuEstoque = document.querySelector('.estoque-contain');
const menuHistorico = document.querySelector('.historico-contain');
const setaPedidos = document.querySelector('#seta-pedidos');

if (botaoProdutos) {
    botaoProdutos.addEventListener('click', function() {
        const urlAtual = window.location.href.toLowerCase();
        
        if (urlAtual.includes('fornecedor')) {
            window.location.href = 'estoque.html';
        } 

        else {
            if (menuEstoque && menuHistorico && setaPedidos) {
                menuEstoque.classList.toggle('oculto');
                menuHistorico.classList.toggle('oculto');
                setaPedidos.classList.toggle('fechado');
            }
        }
    });
}


//nova categoria
document.addEventListener('DOMContentLoaded', () => {
    
    const detalhesAdd = document.getElementById('adicionar-tipo');
    const summaryAdd = document.getElementById('summary-adicionar');
    const textoAdd = document.getElementById('texto-adicionar');
    const inputNova = document.getElementById('input-nova-categoria');

    if (detalhesAdd && summaryAdd && textoAdd && inputNova) {
        
        const paletaCoresPasteis = ['#A7D4FF', '#FFB4A7', '#A7FFBE', '#c6a7ff', '#fff6a7'];

        const categoriasSalvas = obterCategorias();
        
        categoriasSalvas.forEach((categoria, index) => {
            const cor = paletaCoresPasteis[index % paletaCoresPasteis.length];
            const idUnico = `categoria-salva-${index}`;
            
            const cardHtml = `
                <details class="tipo-produtos" id="${idUnico}">
                    <summary>
                        <div class="tipo-header">
                            <span class="dot" style="background-color: ${cor};"></span>
                            <p>${categoria}</p>
                        </div>
                    </summary>

                    <table class="conteudo-cards">
                        <thead>
                            <tr class="colunas">
                                <th class="coluna-produto">Produto</th>
                                <th class="coluna-fornecedor">Fornecedor</th>
                                <th class="coluna-valor-uni">Valor unitário</th>
                                <th class="coluna-valor-total">Valor total</th>
                                <th class="coluna-quantidade">Quantidade</th>
                                <th class="coluna-data-compra">Data da compra</th>
                                <th class="coluna-em-estoque">Em estoque</th>
                            </tr>
                        </thead>
                        <tbody class="celulas" data-categoria="${categoria}"></tbody>
                    </table>
                </details>
            `;
            detalhesAdd.insertAdjacentHTML('beforebegin', cardHtml);
        });

        const produtosSalvos = obterProdutos();
        produtosSalvos.forEach(produto => {
            const tbody = document.querySelector(`tbody[data-categoria="${produto.tipo}"]`);
            
            if (tbody) {
                const qtd = parseInt(produto.quantidade);
                let badgeClass = 'badge-alto'; 
                
                if (qtd <= 1) {
                    badgeClass = 'badge-baixo';
                } else if (qtd === 2) {
                    badgeClass = 'badge-medio'; 
                }

                const linhaProduto = `
                    <tr>
                        <td>${produto.nome}</td>
                        <td>${produto.fornecedor}</td>
                        <td>R$ ${produto.valorUnitario}</td>
                        <td>R$ ${produto.valorTotal}</td>
                        <td>${produto.quantidade}</td>
                        <td>${produto.dataCompra}</td>
                        <td><span class="badge-estoque ${badgeClass}">${produto.quantidade}</span></td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', linhaProduto);
            }
        });

        summaryAdd.addEventListener('click', (e) => {
            e.preventDefault();
            if (inputNova.classList.contains('oculto')) {
                textoAdd.classList.add('oculto');
                inputNova.classList.remove('oculto');
                inputNova.focus();
            }
        });

        const salvarCategoria = async () => {
            const nomeCategoria = inputNova.value.trim();
            if (nomeCategoria !== '') {
                const totalCategorias = obterCategorias().length;
                const corNova = paletaCoresPasteis[totalCategorias % paletaCoresPasteis.length];
                const idUnico = `categoria-nova-${Date.now()}`; 
                
                const novoCardHtml = `
                    <details class="tipo-produtos" id="${idUnico}">
                        <summary>
                            <div class="tipo-header">
                                <span class="dot" style="background-color: ${corNova};"></span>
                                <p>${nomeCategoria}</p>
                            </div>
                        </summary>

                        <table class="conteudo-cards">
                            <thead>
                                <tr class="colunas">
                                    <th class="coluna-produto">Produto</th>
                                    <th class="coluna-fornecedor">Fornecedor</th>
                                    <th class="coluna-valor-uni">Valor unitário</th>
                                    <th class="coluna-valor-total">Valor total</th>
                                    <th class="coluna-quantidade">Quantidade</th>
                                    <th class="coluna-data-compra">Data da compra</th>
                                    <th class="coluna-em-estoque">Em estoque</th>
                                </tr>
                            </thead>
                            <tbody class="celulas" data-categoria="${nomeCategoria}"></tbody>
                        </table>
                    </details>
                `;

                detalhesAdd.insertAdjacentHTML('beforebegin', novoCardHtml);
                await salvarCategoriaNoBanco(nomeCategoria);
            }
            inputNova.value = ''; 
            textoAdd.classList.remove('oculto'); 
            inputNova.classList.add('oculto'); 
        };

        inputNova.addEventListener('blur', salvarCategoria);
        inputNova.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') inputNova.blur();
        });
    }
});


//restricoes para quantidade, valor uni e valor atual

document.addEventListener('DOMContentLoaded', () => {

    const inputQuantidade = document.getElementById('quantidade');

    if (inputQuantidade) {
        inputQuantidade.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        inputQuantidade.addEventListener('blur', function() {
            if (this.value !== '') {
                const valor = parseInt(this.value);
                if (valor < 1) {
                    this.value = 1; 
                }
            }
        });
    }

    const inputsValor = [
        document.getElementById('valor-unitario'), 
        document.getElementById('valor-total')
    ];

    inputsValor.forEach(input => {
        if (!input) return;

        input.addEventListener('input', function() {
            let val = this.value.replace(/[^0-9.,]/g, '');
            val = val.replace('.', ',');
            const partes = val.split(',');
            if (partes.length > 2) {
                val = partes[0] + ',' + partes.slice(1).join('');
            }

            this.value = val;
        });

        input.addEventListener('blur', function() {
            if (this.value !== '') {
                let numero = parseFloat(this.value.replace(',', '.'));
                
                if (!isNaN(numero)) {
                    if (numero < 0) numero = 0;
                    this.value = numero.toFixed(2).replace('.', ',');
                } else {
                    this.value = '';
                }
            }
        });
    });

});

//novo fornecedor
document.addEventListener('DOMContentLoaded', () => {

    const listaFornecedoresContainer = document.getElementById('lista-fornecedores');

    if (listaFornecedoresContainer) {
        const fornecedoresSalvos = obterFornecedores();
        listaFornecedoresContainer.innerHTML = ''; 

        if (fornecedoresSalvos.length === 0) {
            listaFornecedoresContainer.innerHTML = `
                <div class="mensagem-vazia">
                    Nenhum fornecedor cadastrado.
                </div>
            `;
        } else {
            fornecedoresSalvos.forEach((fornecedor) => {
                const cardHtml = `
                    <details class="card-fornecedor">
                        <summary>
                            <div class="seta-fornecedor"></div>
                            ${fornecedor.nomeFantasia}
                        </summary>

                        <div class="fornecedor-detalhes">
                            <p><strong>Razão social:</strong> ${fornecedor.razaoSocial}</p>
                            <p><strong>CNPJ:</strong> ${fornecedor.cnpj}</p>
                            <p><strong>Contato:</strong> ${fornecedor.contato}</p>
                            <p><strong>Endereço:</strong> ${fornecedor.endereco}</p>
                        </div>
                    </details>
                `;
                listaFornecedoresContainer.insertAdjacentHTML('beforeend', cardHtml);
            });
        }
    }

    const btnSalvarFornecedor = document.querySelector('.salvar');
    const inputNomeFantasia = document.getElementById('nome-fantasia');

    if (btnSalvarFornecedor && inputNomeFantasia) {
        btnSalvarFornecedor.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const nomeFantasia = inputNomeFantasia.value.trim();
            const cnpj = document.getElementById('cnpj').value.trim();
            const razaoSocial = document.getElementById('razao-social').value.trim();
            const contato = document.getElementById('contato').value.trim();
            const rua = document.getElementById('rua').value.trim();
            const bairro = document.getElementById('bairro').value.trim();
            const cep = document.getElementById('cep').value.trim();
            const estado = document.getElementById('estado').value.trim();
            const enderecoCompleto = `${rua} - ${bairro}, ${estado}, ${cep}`;

            if (nomeFantasia !== '' && cnpj !== '') {
                const novoFornecedor = {
                    nomeFantasia: nomeFantasia,
                    razaoSocial: razaoSocial,
                    cnpj: cnpj,
                    contato: contato,
                    endereco: enderecoCompleto
                };

                await salvarFornecedorNoBanco(novoFornecedor);
                
                window.location.href = 'fornecedores.html'; 
            }
        });
    }
});

//leva as infos para a o cadastro de produtos
document.addEventListener('DOMContentLoaded', () => {
    
    const selectTipo = document.getElementById('tipo');
    if (selectTipo) {
        const categoriasSalvas = obterCategorias();
        selectTipo.innerHTML = '<option value="" disabled selected>Selecione um tipo</option>';
        categoriasSalvas.forEach(categoria => {
            const opcao = document.createElement('option');
            opcao.value = categoria; 
            opcao.textContent = categoria; 
            selectTipo.appendChild(opcao);
        });
    }

    const selectFornecedor = document.getElementById('fornecedor');
    if (selectFornecedor) {
        const fornecedoresSalvos = obterFornecedores();
        
        selectFornecedor.innerHTML = '<option value="" disabled selected>Selecione um fornecedor</option>';
        
        fornecedoresSalvos.forEach(fornecedor => {
            const opcao = document.createElement('option');
            opcao.value = fornecedor.nomeFantasia;
            opcao.textContent = fornecedor.nomeFantasia;
            selectFornecedor.appendChild(opcao);
        });
    }
});

//salva as infos do produto
document.addEventListener('DOMContentLoaded', () => {
    const btnSalvarProduto = document.getElementById('btn-salvar-produto');
    const inputNomeProduto = document.getElementById('nome-produto');

    if (btnSalvarProduto && inputNomeProduto) {
        btnSalvarProduto.addEventListener('click', async (e) => {
            e.preventDefault();

            const nome = inputNomeProduto.value.trim();
            const fornecedor = document.getElementById('fornecedor').value;
            const quantidade = document.getElementById('quantidade').value.trim();
            const valorUnitario = document.getElementById('valor-unitario').value.trim();
            const valorTotal = document.getElementById('valor-total').value.trim();
            const tipo = document.getElementById('tipo').value;
            const dataCompra = document.getElementById('data-compra').value;

            if (nome !== '' && fornecedor && tipo) {
                
                let dataFormatada = '--/--/----';
                if(dataCompra) {
                    const partes = dataCompra.split('-');
                    dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
                }

                const novoProduto = {
                    nome: nome,
                    fornecedor: fornecedor,
                    quantidade: quantidade || '0',
                    valorUnitario: valorUnitario || '0,00',
                    valorTotal: valorTotal || '0,00',
                    tipo: tipo,
                    dataCompra: dataFormatada
                };

                await salvarProdutoNoBanco(novoProduto);
                window.location.href = 'estoque.html';
            }
        });
    }
});

//pesquisa funcional de produtos
document.addEventListener('DOMContentLoaded', () => {
    
    const inputPesquisa = document.querySelector('.input-pesquisa');

    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', function() {
            const termoPesquisa = this.value.toLowerCase().trim();
            const categorias = document.querySelectorAll('details.tipo-produtos:not(#adicionar-tipo)');
            
            categorias.forEach(categoria => {
                const linhasProdutos = categoria.querySelectorAll('tbody tr');
                let temProdutoVisivel = false;
                
                linhasProdutos.forEach(linha => {
                    const nomeProduto = linha.querySelector('td:nth-child(1)').textContent.toLowerCase();
                    
                    if (nomeProduto.includes(termoPesquisa)) {
                        linha.style.display = ''; 
                        temProdutoVisivel = true;
                    } else {
                        linha.style.display = 'none';
                    }
                });

                if (termoPesquisa !== '') {
                    if (temProdutoVisivel) {
                        categoria.style.display = ''; 
                        categoria.setAttribute('open', 'true'); 
                    } else {
                        categoria.style.display = 'none'; 
                    }
                } else {
                    categoria.style.display = ''; 
                    categoria.removeAttribute('open');
                }
            });
        });
    }
});

//pesquisa funcional de fornecedores
document.addEventListener('DOMContentLoaded', () => {
    const listaFornecedores = document.getElementById('lista-fornecedores');
    const inputPesquisaFornecedor = document.querySelector('.input-pesquisa');

    if (listaFornecedores && inputPesquisaFornecedor) {
        
        inputPesquisaFornecedor.addEventListener('input', function() {
            const termoPesquisa = this.value.toLowerCase().trim();
            const cardsFornecedores = listaFornecedores.querySelectorAll('.card-fornecedor');

            cardsFornecedores.forEach(card => {
                const textoCard = card.textContent.toLowerCase();

                if (textoCard.includes(termoPesquisa)) {
                    card.style.display = '';

                    if (termoPesquisa !== '') {
                        card.setAttribute('open', 'true');
                    } else {
                        card.removeAttribute('open');
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

//select da categoria e do produto
document.addEventListener('DOMContentLoaded', () => {
    const selectProdutoSaida = document.getElementById('produto-saida');
    const selectCategoria = document.getElementById('categoria');
    if (selectProdutoSaida) {
        const produtosDoEstoque = obterProdutos();
        selectProdutoSaida.innerHTML = '<option value="" disabled selected>Selecione um produto</option>';
        
        produtosDoEstoque.forEach(produto => {
            const opcao = document.createElement('option');
            opcao.value = produto.nome; 
            opcao.textContent = `${produto.nome} (Estoque: ${produto.quantidade})`; 
            selectProdutoSaida.appendChild(opcao);
        });
    }

    if (selectCategoria) {
        const categoriesSalvas = obterCategorias();
        selectCategoria.innerHTML = '<option value="" disabled selected>Selecione uma categoria</option>';
        
        categoriesSalvas.forEach(categoria => {
            const opcao = document.createElement('option');
            opcao.value = categoria;
            opcao.textContent = categoria;
            selectCategoria.appendChild(opcao);
        });
    }

    if (selectProdutoSaida && selectCategoria) {
        selectProdutoSaida.addEventListener('change', function() {
            const nomeProdutoSelecionado = this.value;
            const produtosSalvos = obterProdutos();
            const produtoEncontrado = produtosSalvos.find(p => p.nome === nomeProdutoSelecionado);
            
            if (produtoEncontrado) {
                selectCategoria.value = produtoEncontrado.tipo;
                selectCategoria.disabled = true; 
            }
        });
    }
});


// salvar saida
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('cadastrar-saida')) {
        const btnSalvarSaida = document.getElementById('btn-salvar-produto');
        
        if (btnSalvarSaida) {
            btnSalvarSaida.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const produto = document.getElementById('produto-saida').value;
                const categoria = document.getElementById('categoria').value;
                const quantidade = document.getElementById('quantidade').value.trim();

                if (produto && categoria && quantidade) {
                    
                    const qtdSolicitada = parseInt(quantidade);
                    const produtosSalvos = obterProdutos();
                    const produtoEncontrado = produtosSalvos.find(p => p.nome === produto);
                    
                    if (produtoEncontrado) {
                        const estoqueAtual = parseInt(produtoEncontrado.quantidade);
                        
                        if (qtdSolicitada > estoqueAtual) {
                            alert(`Operação negada! A quantidade solicitada (${qtdSolicitada}) é maior do que o estoque disponível (${estoqueAtual}).`);
                            return;
                        }
                    }
                    
                    const dataAtual = new Date();
                    const dia = String(dataAtual.getDate()).padStart(2, '0');
                    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
                    const dataFormatada = `${dia}/${mes}`; 
                    
                    const horas = String(dataAtual.getHours()).padStart(2, '0');
                    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
                    const horarioFormatado = `${horas}:${minutos}`; 

                    const setorLogado = document.querySelector('.troca-perfil #cargo').textContent.trim();

                    const novaSaida = {
                        produto: produto,
                        categoria: categoria,
                        quantidade: quantidade,
                        data: dataFormatada,
                        horario: horarioFormatado,
                        setor: setorLogado
                    };

                    await salvarSaidaNoBanco(novaSaida);
                    window.location.href = 'saidas.html';
                }
            });
        }
    }
});

// historico de saidas
document.addEventListener('DOMContentLoaded', () => {
    const listaSaidas = document.getElementById('lista-saidas');

    if (listaSaidas) {
        const saidas = obterSaidas();
        const categoriasSalvas = obterCategorias();
        const paletaCoresPasteis = ['#A7D4FF', '#FFB4A7', '#A7FFBE', '#c6a7ff', '#fff6a7'];

        listaSaidas.innerHTML = '';

        const saidasPorCategoria = {};
        saidas.forEach(saida => {
            if (!saidasPorCategoria[saida.categoria]) saidasPorCategoria[saida.categoria] = [];
            saidasPorCategoria[saida.categoria].push(saida);
        });

        categoriasSalvas.forEach((categoria, index) => {
            const saidasDestaCategoria = saidasPorCategoria[categoria];
            
            if (saidasDestaCategoria && saidasDestaCategoria.length > 0) {
                const cor = paletaCoresPasteis[index % paletaCoresPasteis.length];

                const saidasPorData = {};
                saidasDestaCategoria.forEach(s => {
                    if (!saidasPorData[s.data]) saidasPorData[s.data] = [];
                    saidasPorData[s.data].push(s);
                });

                let HTMLdasDatas = '';
                
                for (const [data, itens] of Object.entries(saidasPorData)) {
                    let linhasTabela = '';
                    
                    itens.forEach(item => {
                        linhasTabela += `
                            <tr>
                                <td>${item.horario}</td>
                                <td>${item.produto}</td>
                                <td>${item.setor}</td>
                                <td>${item.quantidade}</td>
                            </tr>
                        `;
                    });

                    HTMLdasDatas += `
                        <details class="data-saida">
                            <summary>
                                <div class="seta-data"></div>
                                <p>${data}</p>
                            </summary>
                            <table class="tabela-saidas">
                                <thead>
                                    <tr>
                                        <th>Horário</th>
                                        <th>Produto</th>
                                        <th>Setor</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${linhasTabela}
                                </tbody>
                            </table>
                        </details>
                    `;
                }
                const cardHtml = `
                    <details class="tipo-produtos">
                        <summary>
                            <div class="tipo-header">
                                <span class="dot" style="background-color: ${cor};"></span>
                                <p>${categoria}</p>
                            </div>
                        </summary>
                        <div class="datas-container">
                            ${HTMLdasDatas}
                        </div>
                    </details>
                `;
                listaSaidas.insertAdjacentHTML('beforeend', cardHtml);
            }
        });
    }
});


//login
const btnEntrar = document.getElementById('btn-entrar');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const msgErro = document.getElementById('mensagem-erro');

btnEntrar.addEventListener('click', async () => {
    btnEntrar.textContent = "Aguarde...";
    await new Promise(resolve => setTimeout(resolve, 0));

    const email = emailInput.value;
    const senha = senhaInput.value;

    if (email === "joaodasilva@cac.br" && senha === "12345") {
        localStorage.setItem('perfilAtivo', 'Joao');
        window.location.href = "administrativo/estoque.html";
    } else {
        msgErro.style.display = "block";
        btnEntrar.textContent = "Entrar";
    }
});