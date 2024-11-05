import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { Href, router } from "expo-router";


interface MenuProps {
    tela:string
}


export function Menu({tela}:MenuProps){

    return(
        
        <View style={style.container}>
            <TouchableOpacity style={style.botoes} onPress={()=> router.navigate('/visualizarCadastros/Agenda' as Href)}>
                <FontAwesome5 name="calendar-alt" size={tela=="Agenda" ? 22 : 18} color={tela=="Agenda" ?"#ec4899":"#451a03"}/>
                <Text style={tela=="Agenda" ? style.textoBotaoSelecionado : style.textoBotao}>Agenda</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.botoes} onPress={()=> router.navigate('/visualizarCadastros/Clientes' as Href)}>
                <FontAwesome5 name="user-plus" size={tela=="Clientes" ? 22 : 18} color={tela=="Clientes" ?"#ec4899":"#451a03"}/>
                <Text style={tela=="Clientes" ? style.textoBotaoSelecionado : style.textoBotao}>Clientes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.botoes} onPress={()=> router.navigate('/home' as Href)}>
                <FontAwesome5 name="home" size={tela=="Home" ? 22 : 18} color={tela=="Home" ?"#ec4899":"#451a03"}/>
                <Text style={tela=="Home" ? style.textoBotaoSelecionado : style.textoBotao}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.botoes} onPress={()=> router.navigate('/visualizarCadastros/Produtos' as Href)}>
                <FontAwesome5 name="birthday-cake" size={tela=="Produtos" ? 22 : 18} color={tela=="Produtos" ?"#ec4899":"#451a03"}/>
                <Text style={tela=="Produtos" ? style.textoBotaoSelecionado : style.textoBotao}>Produtos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.botoes} onPress={()=> router.navigate('/visualizarCadastros/Vendas' as Href)}>
                <FontAwesome5 name="store" size={tela=="Vendas" ? 22 : 18} color={tela=="Vendas" ?"#ec4899":"#451a03"}/>
                <Text style={tela=="Vendas" ? style.textoBotaoSelecionado : style.textoBotao}>Vendas</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        width: "90%",
        height:70,
        flexDirection:"row",
        zIndex:10,
        position:"absolute",
        bottom:15,
        left:((Number(Dimensions.get('window').width)*0.1)/2),
        backgroundColor:"#fff",
        borderRadius: 50,
        borderColor: "#f472b6", 
        borderWidth: 1,   
    
        // Sombras para iOS
        shadowColor: '#000',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    botoes:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        
    },
    botaoCentral:{
        flex:1,
        justifyContent:"flex-start",
        alignItems:"center"
    },
    textoBotao:{
        fontWeight:"bold",
        marginTop:5,
        color:"#451a03"
    },
    textoBotaoSelecionado:{
        fontWeight:"bold",
        marginTop:5,
        color: "#ec4899"
    }
});