import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native";

interface ModalQuantidadeProps {
    modalVisivel: boolean,
    setModalVisivel: React.Dispatch<React.SetStateAction<boolean>>,
    setQuantidadesComZero: React.Dispatch<React.SetStateAction<{
        quantidade: string;
    }[]>>,
    setQuantidadesSemZero: React.Dispatch<React.SetStateAction<{
        quantidade: string;
    }[]>>,
    quantidadesSemZero: {quantidade: string;}[],
    quantidadesComZero:{quantidade: string;}[],
    
}

export function ModalQuantidade({modalVisivel,quantidadesComZero,quantidadesSemZero,setQuantidadesComZero,setQuantidadesSemZero,setModalVisivel}:ModalQuantidadeProps){
    const [campoQuantidade,setCampoQuantidade] = useState(false);

    const [quantidadeNova,setQuantidadeNova] = useState(0);

    function adicionarQuantidade(){
        let quantidadesComZeroTemporario = [...quantidadesComZero];
        let quantidadesSemZeroTemporario = [...quantidadesSemZero];
        quantidadesComZeroTemporario.push({quantidade:String(quantidadeNova)});
        quantidadesSemZeroTemporario.push({quantidade:String(quantidadeNova)});
        setQuantidadesComZero(quantidadesComZeroTemporario);
        setQuantidadesSemZero(quantidadesSemZeroTemporario);
        

        setModalVisivel(false);
        setQuantidadeNova(0)
    }

    return(
        <Modal visible={modalVisivel} animationType="fade" statusBarTranslucent transparent>
                <View style={style.modal}>
                    <TouchableOpacity style={style.fecharModal} onPress={()=> setModalVisivel(false)}><AntDesign name="close" size={20} color="#451a03"/></TouchableOpacity>
                    <View style={style.formModal}>
                        <Text style={{fontWeight:"bold",marginBottom:5}}>Adicione uma quantidade de acordo com a sua necessidade.</Text>
                        <Text style={{marginBottom:5}}>Quantidade</Text>
                        <TextInput style={campoQuantidade ? style.input_selecionado : style.input} onFocus={()=> setCampoQuantidade(true)} onBlur={()=> setCampoQuantidade(false)} placeholder="Digite a quantidade" keyboardType="number-pad" value={String(quantidadeNova)} onChangeText={item=> setQuantidadeNova(Number(item))}/>
                        <TouchableOpacity style={style.botaoSalvar} onPress={()=>adicionarQuantidade()}>
                            <Text style={style.textoBotaoSalvar}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
    )
}

const style = StyleSheet.create({
    
    modal:{
        width:"80%",
        backgroundColor:"#fff",
        position:"absolute",
        top:"40%",
        left:"10%",
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
        marginBottom:10,
        
    },
    formModal:{
        padding:30,
        flex:1,
        flexDirection:"column",
    },
    fecharModal:{
        position:"absolute",
        right:10,
        top:10,
        padding:5,
        zIndex:1000
    },
    cabecalho:{
        height:110,
        width:"100%",
        backgroundColor:"#451a03",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"flex-end",
        borderColor: "#451a03", 
        paddingHorizontal:20,
        borderWidth: 1,   
        zIndex:10,
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
        // borderBottomEndRadius:20,
        // borderBottomStartRadius:20,
        
    },
    botao:{
        backgroundColor:"white",
        borderRadius:50,
        padding:2,
        borderColor: "#000", 
        borderWidth: 1,
        zIndex:10,
        width:30,
        height:30,
        marginBottom:5,
        justifyContent:"center",
        alignItems:"center",   
    
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    tituloBotao:{
        color:"#451a03",
        fontSize:16,
        fontWeight:"bold",
        
        justifyContent:"center",
        
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
    input:{
        width: '100%',
        height: 40,
        borderColor: "#e5e7eb", 
        borderWidth: 1,      
        borderRadius: 5,     
        paddingHorizontal: 10,
        backgroundColor: "white",
        
    },
    textoBotaoSalvar:{
        color:"#fff",
        textAlign:"center",
        fontSize:18,
        fontWeight:"bold"
    },
    input_selecionado:{
        borderColor: "#f472b6",
        width: '100%',
        height: 40,
        borderWidth: 1,      
        borderRadius: 5,     
        paddingHorizontal: 10,
        backgroundColor: "white", 
    }
});