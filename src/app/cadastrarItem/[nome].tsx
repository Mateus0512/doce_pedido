import { StatusBar } from "@/componentes/statusBar";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Text, View,StyleSheet, TextInput, Alert, Keyboard , TouchableWithoutFeedback, Pressable, TouchableOpacity} from "react-native";
import { useClienteOuProdutoDatabase } from "../database/useClienteOuProdutoDatabase";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Cabecalho } from "@/componentes/cabecalho";

export default function CadastrarItem(){
    const params = useLocalSearchParams<{nome:string}>()

    const [nome,setNome] = useState('');
    const [telefoneOuPreco, setTelefoneOuPreco] = useState('');
    const [campoNomeSelecionado,setCampoNomeSelecionado] = useState(false);
    const [campoTelefoneOuPreco,setCampoTelefoneOuPreco] = useState(false);

    const telefoneOuPrecoRef = useRef<TextInput>(null)

    const clinteOuProdutoDatabase = useClienteOuProdutoDatabase();




    async function criarCliente() {
        try {
            if(nome.trim()==""){
                Alert.alert("Aviso","Por favor, preencha o campo de nome do cliente para continuar.");
                return
            }
            if(telefoneOuPreco.trim()==""){
                Alert.alert("Aviso","Por favor, preencha o campo de telefone do cliente para continuar.");
                return
            }

            const nomeUnico = await clinteOuProdutoDatabase.verificarNome(nome.toLowerCase().trim(),params.nome.toLowerCase());
            if(nomeUnico?.nome){
                Alert.alert("Aviso","Já existe um cliente cadastrado com esse nome. Por favor, insira um nome único para o cliente.")
            }else{
                const response = await clinteOuProdutoDatabase.criarCliente({ nome,telefone: telefoneOuPreco});
                Alert.alert("Cliente Cadastrado.");
                router.back();
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function criarProduto() {
        try {
            if(nome.trim()==""){
                Alert.alert("Aviso","Por favor, preencha o campo de nome do produto para continuar");
                return
            }
            if(telefoneOuPreco.trim()==""){
                Alert.alert("Aviso","Por favor, preencha o campo de preço do produto para continuar.");
                return
            }

            const nomeUnico = await clinteOuProdutoDatabase.verificarNome(nome.toLowerCase().trim(),params.nome.toLowerCase());
            if(nomeUnico?.nome){
                Alert.alert("Aviso","Já existe um produto cadastrado com esse nome. Por favor, insira um nome único para o produto.")
            }else{
                const response = await clinteOuProdutoDatabase.criarProduto({nome, preco: Number(telefoneOuPreco)});
                Alert.alert("Produto cadastrado.");
                router.back();
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    function criarRegistro(){
        if(params.nome==="Clientes"){
            criarCliente();
        }else if(params.nome==="Produtos"){
            criarProduto();
        }
    }

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
        //console.log(formattedPhone.length)
        setTelefoneOuPreco(formattedPhone);
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
         (integerPart.length > 0 ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0') + '.' + decimalPart;
 
         setTelefoneOuPreco(formattedValue);
       }

       

    
    return(
        <View  style={{flex:1,backgroundColor:"#451a03"}}>
            
            <ExpoStatusBar backgroundColor="#451a03"/>
            <StatusBar/>
            <Cabecalho titulo={`Cadastro de ${params.nome}`} botaoVoltar={true} />
            <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                
                <View style={style.container}>

                
                <View style={style.form}>
                    <Pressable style={style.botaoAdd} onPress={()=> router.navigate('/cadastrarVariosItens/'+params.nome as Href)}>
                        <MaterialCommunityIcons name="numeric-9-plus-box-multiple-outline" color="rgb(216, 27, 96)" size={24} />
                    </Pressable>

                    
                    <Text>Nome</Text>
                    <TextInput placeholderTextColor="gray"  placeholder="Nome" value={nome} onChangeText={setNome} style={campoNomeSelecionado? style.input_selecionado : style.input} onFocus={()=> setCampoNomeSelecionado(true)} onBlur={()=>setCampoNomeSelecionado(false)} onSubmitEditing={()=> telefoneOuPrecoRef.current?.focus()} returnKeyType="next"/>
                    {params.nome==="Clientes" &&
                    <>
                    <Text>Telefone</Text>
                    <TextInput placeholderTextColor="gray" ref={telefoneOuPrecoRef}  placeholder="Telefone" value={telefoneOuPreco} onChangeText={handlePhoneChange} style={campoTelefoneOuPreco? style.input_selecionado : style.input} onFocus={()=> setCampoTelefoneOuPreco(true)} onBlur={()=> setCampoTelefoneOuPreco(false)} keyboardType="numeric" onSubmitEditing={()=> criarRegistro()} />
                    </>
                    
                    }
                    {params.nome==="Produtos" &&
                    <>
                    <Text>Preço</Text>
                    <TextInput placeholderTextColor="gray" ref={telefoneOuPrecoRef}   placeholder="Preço"  value={telefoneOuPreco} onChangeText={formatValue} style={campoTelefoneOuPreco? style.input_selecionado : style.input} onFocus={()=> setCampoTelefoneOuPreco(true)} onBlur={()=> setCampoTelefoneOuPreco(false)} keyboardType="numeric" onSubmitEditing={()=> criarRegistro()} />
                    </>
                    }

                    <TouchableOpacity style={style.botaoSalvar} onPress={criarRegistro}>
                        <Text style={style.textoBotaoSalvar}>Salvar</Text>
                    </TouchableOpacity>
                </View>
                
                </View>
            </TouchableWithoutFeedback>
                
            
             
           
        
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
        borderColor: "#f472b6",
        width: '100%',
        height: 40,
        borderWidth: 1,      
        borderRadius: 5,     
        paddingHorizontal: 10,
        backgroundColor: "white", 
    },
    botaoAdd:{
        position:"absolute",
        top:5,
        right: 10
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
    titulo:{
        color:"#fff",
        fontSize:16,
        fontWeight:"bold",
        marginBottom:10
    }
});