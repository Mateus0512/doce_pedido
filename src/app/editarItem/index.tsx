import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View,StyleSheet, TextInput, Alert, TouchableOpacity} from "react-native";
import { useClienteOuProdutoDatabase } from "../database/useClienteOuProdutoDatabase";
import { Cabecalho } from "@/componentes/cabecalho";

export default function EditarItem(){
    const params = useLocalSearchParams<{id:string,tabela:string}>();


    const [nome, setNome] = useState('');
    const [telefone,setTelefone] = useState('');
    const [preco,setPreco] = useState('');

    const [campoNomeSelecionado,setCampoNomeSelecionado] = useState(false);
    const [campoTelefoneOuPreco,setCampoTelefoneOuPreco] = useState(false);




    const clientesOuProdutosDatabase = useClienteOuProdutoDatabase();

    useEffect( ()=>{
        


        if(params.id){
            clientesOuProdutosDatabase.selecionarItem(Number(params.id),params.tabela).then(item=>{
                if(item){
                    setNome(item.nome);
                    if(item.telefone){
                        setTelefone(item.telefone);
                    }
                    if(item.preco){
                        setPreco(item.preco.toFixed(2));
                    }
                    
                }
            })
        }
    },[params.id]);

    const handlePhoneChange = (text:string) => {
        // Remove todos os caracteres que não são dígitos
        const cleanText = text.replace(/\D/g, '');
    
        // Formatação do telefone
        let formattedPhone = cleanText;
        if (cleanText.length > 10) {
          formattedPhone = `(${cleanText.slice(0, 2)}) ${cleanText.slice(2, 7)}-${cleanText.slice(7, 11)}`;
        } else if (cleanText.length > 6) {
          formattedPhone = `(${cleanText.slice(0, 2)}) ${cleanText.slice(2, 6)}-${cleanText.slice(6, 10)}`;
        } else if (cleanText.length > 2) {
          formattedPhone = `(${cleanText.slice(0, 2)}) ${cleanText.slice(2, 6)}`;
        } else if (cleanText.length > 0) {
          formattedPhone = `(${cleanText.slice(0, 2)}`;
        }
    
        setTelefone(formattedPhone);
      };

      function formatValue(text:string) {
        
        // Remove todos os caracteres não numéricos
         let numericValue = text.replace(/[^0-9]/g, '');
 
     // Mantém pelo menos dois dígitos para as casas decimais
         if (numericValue.length > 2) {
         numericValue = numericValue.replace(/^0+/, '');
         }
 
     // Formata o valor com casas decimais e separadores de milhar
         const integerPart = numericValue.slice(0, -2);
         const decimalPart = numericValue.slice(-2);
 
         const formattedValue =
         (integerPart.length > 0 ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '') + '.' + decimalPart;
 
         setPreco(formattedValue);
       }

       async function alterarItem(){
            try {
                if(params.tabela=="clientes"){
                    try {
                        if(nome.trim()==""){
                            Alert.alert("Insira um nome.");
                            return
                        }
                        if(telefone.trim()==""){
                            Alert.alert("Preencha todos os campos.");
                            return
                        }
                        
                        await clientesOuProdutosDatabase.editarCliente({id:Number(params.id),nome,telefone});
                        Alert.alert("Cliente alterado.");
                        router.back();
                    } catch (error) {
                        console.log(error);
                    }

                    

                }else if(params.tabela=="produtos"){
                    try {
                        if(nome.trim()==""){
                            Alert.alert("Insira um nome.");
                            return
                        }
                        if(String(preco).trim()==""){
                            Alert.alert("Preencha todos os campos.");
                            return
                        }
                        
                        await clientesOuProdutosDatabase.editarProduto({id:Number(params.id),nome,preco:Number(preco)});
                        Alert.alert("Produto alterado.");
                        router.back();
                    } catch (error) {
                        console.log(error);
                    }
                    
                }
                
            } catch (error) {
                console.log(error);
            }
       }

    return(
        <View style={{flex:1,backgroundColor:"#451a03"}}>
            <Cabecalho titulo={`Editar ${params.tabela=="clientes"? "Cliente" : "Produto"}`} botaoVoltar={true}/>
            <View style={style.container}>
                <View style={style.form}>
                    <Text>Nome</Text>
                    <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={campoNomeSelecionado? style.input_selecionado : style.input} onFocus={()=> setCampoNomeSelecionado(true)} onBlur={()=>setCampoNomeSelecionado(false)}/>
                    {params.tabela=="clientes" && 
                    <>
                    <Text>Telefone</Text>
                    <TextInput placeholder="Telefone" value={telefone} onChangeText={handlePhoneChange} style={campoTelefoneOuPreco? style.input_selecionado : style.input} onFocus={()=> setCampoTelefoneOuPreco(true)} onBlur={()=> setCampoTelefoneOuPreco(false)} keyboardType="numeric" />
                    </>
                    }
                    {params.tabela=="produtos" &&
                    <>
                    <Text>Preço</Text>
                    <TextInput placeholder="Preço" value={String(preco)} onChangeText={formatValue} style={campoTelefoneOuPreco? style.input_selecionado : style.input} onFocus={()=> setCampoTelefoneOuPreco(true)} onBlur={()=> setCampoTelefoneOuPreco(false)} keyboardType="numeric" />
                    </>
                    }
                    <TouchableOpacity style={style.botaoSalvar} onPress={alterarItem}>
                        <Text style={style.textoBotaoSalvar}>Salvar</Text>
                    </TouchableOpacity>
                </View>
                
            </View>

        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fdf2f8",
        borderTopEndRadius:20,
        borderTopStartRadius:20,
        paddingHorizontal:5,
        
        
    },
    form:{
        backgroundColor:"#fff",
        paddingVertical:40,
        width:"100%",
        padding: 10,
        gap: 10,
        marginTop:15,
        borderRadius:20,
        borderColor: "#f472b6", 
        borderWidth: 1,   
        zIndex:10,
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
        
    },
    input:{
        width: '100%',
        height: 40,
        borderColor: "#e5e7eb", 
        borderWidth: 1,      
        borderRadius: 5,     
        paddingHorizontal: 10,
        backgroundColor: "white",
    },
    input_selecionado:{
        borderColor: "rgb(216, 27, 96)",
        width: '100%',
        height: 40,
        borderWidth: 1,      
        borderRadius: 5,     
        paddingHorizontal: 10,
        backgroundColor: "white", 
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
