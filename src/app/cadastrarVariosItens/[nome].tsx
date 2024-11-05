import { Href, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert } from "react-native";
import { useClienteOuProdutoDatabase } from "../database/useClienteOuProdutoDatabase";
import { Cabecalho } from "@/componentes/cabecalho";



export default function CadastrarVariosItens(){

    const [registros,setRegistros] = useState('');
    const [campoResgistrosSelecionado,setCampoResgistrosSelecionado] = useState(false);

    const params = useLocalSearchParams<{nome:string}>()

    const clinteOuProdutoDatabase = useClienteOuProdutoDatabase();



    async function prepararQuery() {
        try {
            if (registros === "") {
                Alert.alert("Aviso","Por favor, insira os registros para continuar.");
                return;
            }
            
            let registroSeparadosEmLinha = registros.split('\n');
            
            let registrosSeparados = registroSeparadosEmLinha.map(item => {
                if (item.split('\t').length === 2) {
                    return item.split('\t');
                } else {
                    Alert.alert("Aviso", "A formatação dos registros está incorreta.");
                    return undefined; // Retorna undefined para marcar o erro
                }
            });
            
            // Verifica se algum item retornou como undefined e interrompe se necessário
            if (registrosSeparados.includes(undefined)) {
                return;
            }
            
            let query = 'BEGIN TRANSACTION;';

            let nomesUnicosPromises: Promise<string | null | undefined>[] = [];
            
            if (params.nome === "Clientes") {
                for (const item of registrosSeparados) {
                    if (item !== undefined && item[0] !== '' && item[1] !== "") {
                        nomesUnicosPromises.push(testarNome(item[0].toLowerCase().trim(), params.nome.toLowerCase()));
                        query += `INSERT INTO clientes (nome, telefone) VALUES ('${item[0]}', '${handlePhoneChange(item[1])}');`; 
                    }
                }
            } else if (params.nome === "Produtos") {
                for (const item of registrosSeparados) {
                    if (item !== undefined && item[0] !== '' && item[1] !== "") {
                        nomesUnicosPromises.push(testarNome(item[0].toLowerCase().trim(), params.nome.toLowerCase()));
                        if(isNaN(Number(formatarNumero(item[1])))==true){
                            Alert.alert("Valor Inválido",`O valor inserido "${item[1]}" não é um número válido. Por favor, revise e insira apenas números nos campos apropriados.`);
                            return
                        }
                        query += `INSERT INTO produtos (nome, preco) VALUES ('${item[0]}', '${Number(formatarNumero(item[1]))}');`; 
                    }
                }
            }
            
            // Aguarda a resolução de todas as promessas
            const nomesUnicos = await Promise.all(nomesUnicosPromises);
            
            // Filtra para obter apenas os nomes duplicados
            const nomesDuplicados = nomesUnicos.filter(nome => nome !== null) as string[];
            
            if (nomesDuplicados.length > 0) {
                Alert.alert("Aviso", `Os seguintes nomes já existem no banco de dados: ${nomesDuplicados.join(", ")}`);
                return;
            }
            
            query += "COMMIT;";
            
            // Executa a query gerada
            salvar(query);
        } catch (error) {
            console.log(error);
        }
    }


      

      async function salvar(query:string) {
        try {
            await clinteOuProdutoDatabase.criarVariosRegistros(query);
            Alert.alert('Os registros foram inseridos.')
            router.navigate('/visualizarCadastros/'+params.nome as Href);
        } catch (error) {
            console.log(error);
        }
            
      }

      const handlePhoneChange = (text:string) => {
        // Remove todos os caracteres que não são dígitos
        const cleanText = text.replace(/\D/g, '');

        // Formatação do telefone
        let formattedPhone = cleanText;
        if (cleanText.length > 10) {
          formattedPhone = `(${cleanText.slice(0, 2)}) ${cleanText.slice(2, 7)}-${cleanText.slice(7, 11)}`;
        } else if (cleanText.length > 5) {
          formattedPhone = `(${cleanText.slice(0, 2)}) ${cleanText.slice(2, 6)}-${cleanText.slice(6, 10)}`;
        } else if (cleanText.length > 2) {
          formattedPhone = `(${cleanText.slice(0, 2)}) ${cleanText.slice(2, 6)}`;
        } else if (cleanText.length > 0) {
          formattedPhone = `(${cleanText.slice(0, 2)}`;
        }
        //console.log(formattedPhone.length)
        return formattedPhone;
      };

      function formatValue(text:string) {
        // Remove todos os caracteres não numéricos
        console.log(text)
         let numericValue = text.replace(/[^0-9]/g, '');
 
     // Mantém pelo menos dois dígitos para as casas decimais
         if (numericValue.length > 2) {
         numericValue = numericValue.replace(/^0+/, '');
         }
 
     // Formata o valor com casas decimais e separadores de milhar
         const integerPart = numericValue.slice(0, -2);
         const decimalPart = numericValue.slice(-2);
 
         const formattedValue =
         (integerPart.length > 0 ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0') + '.' + decimalPart;
 
         return Number(formattedValue);
       }

      function formatarNumero(text:string){
        try {
            if(text.indexOf(',')!==-1){
                let novoValor = text.split(',').join('.');
                return novoValor
            }else
            return text;
        } catch (error) {
            console.log(error);
            
        }
        
      }

      async function testarNome(nome:string,tabela:string) {
        try {
            const nomeUnico = await clinteOuProdutoDatabase.verificarNome(nome.toLowerCase().trim(),tabela.toLowerCase());
            if (nomeUnico && nomeUnico.nome) {
                return nomeUnico.nome;
            }  
            else{   
                return null;
            }
                
        } catch (error) {
            console.log(error);
        }
      }



    return(
        <View style={{flex:1, backgroundColor:"#451a03"}}>
            <Cabecalho titulo={`Cadastro de ${params.nome}`} botaoVoltar={true}/>
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
            <View style={style.container}>
                <Text style={style.texto}>Para inserir varios registros você precisa copiar os dados de uma planilha e pode colar no campo abaixo.</Text>
                <TextInput value={registros} onChangeText={setRegistros} multiline placeholder="Cole os registros aqui." placeholderTextColor="gray" onFocus={() => setCampoResgistrosSelecionado(true)} onBlur={() => setCampoResgistrosSelecionado(false)}  style={campoResgistrosSelecionado ? style.input_selecionado : style.input} />
                <TouchableOpacity style={style.botaoSalvar} onPress={prepararQuery}>
                        <Text style={style.textoBotaoSalvar}>Salvar</Text>
                </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        padding:30,
        backgroundColor: "#fdf2f8",
        borderTopEndRadius:20,
        borderTopStartRadius:20,
    },
    texto:{
        fontWeight:"bold",
        marginBottom:15
    },
    input:{
        backgroundColor: "#fff",
        width:"100%",
        height:"50%",
        padding:30,
        borderRadius: 10,
        borderColor: "#000", 
        borderWidth: 1,   
    
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    input_selecionado:{
        backgroundColor: "#fff",
        width:"100%",
        height:"50%",
        padding:30,
        borderRadius: 10,
        borderColor: "rgb(216, 27, 96)", 
        borderWidth: 1,   
    
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    botaoSalvar:{
        width:"100%",
        backgroundColor:"#451a03",
        height:50,
        marginHorizontal:"auto",
        justifyContent:"center",
        borderRadius:20,
        marginTop:20
    },
    textoBotaoSalvar:{
        color:"#fff",
        textAlign:"center",
        fontSize:18,
        fontWeight:"bold"
    },
});

