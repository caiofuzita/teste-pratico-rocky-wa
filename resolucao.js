fs = require('fs'); // importa o módulo filesystem para abrir e salvar arquivos JSON https://nodejs.org/api/fs.html#fsreadfilepath-options-callback

var brokenJson = readJson(); // atribui o arquivo corrompido à variável brokenJson

// laço para executar as devidas correções em todos os elementos
for (var i in brokenJson) {
    brokenJson[i]['name'] = fixName(brokenJson[i]['name']);
    brokenJson[i]['quantity'] = fixQuantity(brokenJson[i]['quantity']);
    brokenJson[i]['price'] = fixPrice(brokenJson[i]['price']);
}

// salva o arquivo com o nome 'saida.json'
writeJson(brokenJson);

// atribui o arquivo corrigido à variável fixedJson
var fixedJson = readFixedJson();

// ordena as categorias por ordem alfabética, e em seguida, por ID crescente
fixedJson.sort(function compare(a, b){
    return (a.category > b.category) ? 1 : (a.category < b.category) ? -1 : (a.id > b.id) ? 1 : (a.id < b.id) ? -1 : 0;
}); //https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/sort


console.log(fixedJson);

// atribui as categorias únicas à variável categoriaProdutos
var categoriaProdutos = verifyCategory();

// realiza o cálculo de estoque de acordo com cada categoria existente na variável categoriaProdutos
for (var i = 0; i < categoriaProdutos.length; i++) {
    var produtos = fixedJson.filter((search) => {
        return search.category == categoriaProdutos[i];
    }) 
    console.log(categoriaProdutos[i], calculadora(produtos))
}

// funções

// abre o arquivo .json
function readJson(){
    const data = fs.readFileSync('./broken-database.json','utf8'); // abre o arquivo JSON
    return JSON.parse(data); // transforma o JSON em objeto javascript
}

// corrige os nomes
function fixName(str){
    return str.replace(/æ/g, 'a').replace(/¢/g, 'c').replace(/ø/g, 'o').replace(/ß/g, 'b'); //https://www.devmedia.com.br/javascript-replace-substituindo-valores-em-uma-string/39176
}

// corrige as quantidades
function fixQuantity(quantity){
    return quantity || 0; // retorna o valor de quantity, e se não houve um valor, retorna 0;
}

// corrige os preços
function fixPrice(price){
    return Number(price); // transforma tipo string em tipo number
} //https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/parseInt

// salva o arquivo
function writeJson(file){
    var dados = JSON.stringify(file); // transforma o objeto javascript em .json
    fs.writeFileSync('./saida.json', dados);
}

// abre o arquivo corrigido
function readFixedJson(){
    const dataFixed = fs.readFileSync('./saida.json', 'utf8');
    return JSON.parse(dataFixed);
}

// verifica as categorias únicas
function verifyCategory(){
    
    var categorias = []; // criação de um array vazio
    for (var i in fixedJson){
        categorias.push(fixedJson[i].category); // atribui todas as categorias existentes no array 'categorias'
    }
    
    var categoriasUnicas = []; // criação de um array vazio
    
    for (var i = 0; i < categorias.length; i++){
        if (categorias[i] != categorias[i+1]){
            categoriasUnicas.push(categorias[i]); // varredura por todos os elementos da array 'categorias', todos os valores únicos vão para o 'categoriasUnicas'
        }
    }
   
    return categoriasUnicas; // retorna apenas as categorias únicas
}

function calculadora(products){
    var soma = 0; // iniciador da soma
    for (var i in products){
        soma += products[i]['quantity'] * products[i]['price']; // multiplica a quantidade pelo preço
    } 
    return soma 
}

