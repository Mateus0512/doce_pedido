import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, TextInput, Alert, Modal, TouchableOpacity, Pressable, StatusBar } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormularioVendasProdutosProps, useVendasDatabase } from "../database/useVendasDatabase";
import { Dropdown } from "react-native-element-dropdown";
import { ClienteOuProdutosDatabaseProps, useClienteOuProdutoDatabase } from "../database/useClienteOuProdutoDatabase";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { ModalQuantidade } from "@/componentes/modalQuantidade";


export default function EditarVendaProdutos(){
    const {id} = useLocalSearchParams<{id:string}>();
    const [produtosVenda,setProdutosVenda] = useState<FormularioVendasProdutosProps[]>([]);
    const [listaProdutos,setListaProdutos] = useState<ClienteOuProdutosDatabaseProps[]>([])
    const [listaProdutosSelecionados,setListaProdutosSelecionados] = useState<ClienteOuProdutosDatabaseProps[]>([]);

    const [campoDropdownCliente,setCampoDropdownCliente] = useState(false);
    const [campoDropdownQuantidade,setCampoDropdownQuantidade] = useState<boolean[]>([false]);

    const vendasDatabase = useVendasDatabase();
    const clientesOuProdutosDatabase = useClienteOuProdutoDatabase();

    const [modalVisivel,setModalVisivel] = useState(false);

    //const [quantidadeNova,setQuantidadeNova] = useState(0);
    const [quantidadesSemZero,setQuantidadesSemZero] = useState([{quantidade:"1"},{quantidade:"2"},{quantidade:"3"}
        ,{quantidade:"4"},{quantidade:"5"},{quantidade:"6"},{quantidade:"7"},{quantidade:"8"},{quantidade:"9"}]);
    
    const [quantidadesComZero,setQuantidadesComZero] = useState([{quantidade: "0 (Excluir)"},{quantidade:"1"},{quantidade:"2"},{quantidade:"3"}
        ,{quantidade:"4"},{quantidade:"5"},{quantidade:"6"},{quantidade:"7"},{quantidade:"8"},{quantidade:"9"}]);

    async function listar() {
        try {
            const produtos = await vendasDatabase.formularioVendaProdutos(Number(id));
            const products = await clientesOuProdutosDatabase.procurarProdutoPeloNome('');
            setProdutosVenda([...produtos,{venda_id:Number(id),produto_id:0,nome:'',preco:0,quantidade:0}]);
            //filtrarProdutos(products,produtos);

            let quantidadesComZeroTemporario = [...quantidadesComZero];
            let quantidadesSemZeroTemporario = [...quantidadesSemZero];

            setListaProdutos(products);
            atualizarValor(produtos);
            let produtosSelecionado:ClienteOuProdutosDatabaseProps[] = [];

            produtos.map(item=>{
                produtosSelecionado.push({id:item.produto_id,nome:item.nome,preco:item.preco});
                if(item.quantidade>9){
                    quantidadesComZeroTemporario.push({quantidade:String(item.quantidade)});
                    quantidadesSemZeroTemporario.push({quantidade:String(item.quantidade)});
                }
            })

            setQuantidadesComZero(quantidadesComZeroTemporario);
            setQuantidadesSemZero(quantidadesSemZeroTemporario);

            setListaProdutosSelecionados(produtosSelecionado);
        } catch (error) {
            console.log(error);
        }
    }

    async function apagarProduto(id:number){
        try {
            await vendasDatabase.deletarProduto(id);
            
            Alert.alert('Produto excluído da venda.');
            
            listar();
            
        } catch (error) {
            console.log(error);
        }

    }

    async function alterarQuantidade(id:number,quantidade:string) {
        try {
            await vendasDatabase.atualizarQuantidade(id,Number(quantidade));

            Alert.alert('Quantidade atualizada.');
            
            listar();
            
        } catch (error) {
            console.log(error);
        }
    }

    // function adicionarQuantidade(index:number){
    //     console.log(index,quantidadeNova);
    //     let quantidadesComZeroTemporario = [...quantidadesComZero];
    //     let quantidadesSemZeroTemporario = [...quantidadesSemZero];
    //     quantidadesComZeroTemporario[quantidadesComZeroTemporario.length-1] = {quantidade:String(quantidadeNova)}
    //     quantidadesComZeroTemporario[quantidadesComZeroTemporario.length] = {quantidade:"Mais..."}
    //     quantidadesSemZeroTemporario[quantidadesSemZeroTemporario.length-1] = {quantidade:String(quantidadeNova)}
    //     quantidadesSemZeroTemporario[quantidadesSemZeroTemporario.length] = {quantidade:"Mais..."}
    //     setQuantidadesComZero(quantidadesComZeroTemporario);
    //     setQuantidadesSemZero(quantidadesSemZeroTemporario);
    //     setModalVisivel(false)

    //     let produtosVendaTemporario:FormularioVendasProdutosProps[] = [...produtosVenda];

    //     produtosVendaTemporario[index] = {...produtosVendaTemporario[index],quantidade:quantidadeNova}

    //     setProdutosVenda(produtosVendaTemporario);
    //     console.log(index);
    //     console.log(produtosVendaTemporario.length)
    //     if(index===produtosVendaTemporario.length-1){
    //         adicionarProduto(produtosVendaTemporario[index]);
    //     }
    //     else{
    //         alterarQuantidade(produtosVendaTemporario[index].produto_id,String(quantidadeNova));
    //     }
        


    // }

    function filtrarProdutos(listaSemFiltro:ClienteOuProdutosDatabaseProps[],produtosComprados:FormularioVendasProdutosProps[]){
        let listaProdutosFiltrados:ClienteOuProdutosDatabaseProps[] = [...listaSemFiltro];


        for(let i=0;i<produtosComprados.length;i++){
            for(let j=0;j<listaSemFiltro.length;j++){
                if(produtosComprados[i].produto_id===listaSemFiltro[j].id){
                    listaProdutosFiltrados.splice(j,1);
                }
            }
        }
        setListaProdutos(listaProdutosFiltrados);

    }

    function escolherProduto(item:ClienteOuProdutosDatabaseProps, index:number){
        let produtosVendaTemporario:FormularioVendasProdutosProps[] = [...produtosVenda];

        if(item.preco)
        produtosVendaTemporario[index] = {venda_id:Number(id),nome:item.nome,preco:item.preco,produto_id:item.id,quantidade:produtosVendaTemporario[index].quantidade}
        //console.log(produtosVendaTemporario[index]);
        if(produtosVendaTemporario[index].quantidade!==0){
           

            adicionarProduto(produtosVendaTemporario[index]);
        }
        setProdutosVenda(produtosVendaTemporario); 
        
    }

    function quantidadeNovoProduto(item:{quantidade:string},index:number){
        let produtosVendaTemporario:FormularioVendasProdutosProps[] = [...produtosVenda];
    
        produtosVendaTemporario[index] = {...produtosVendaTemporario[index],quantidade:Number(item.quantidade)}
        //console.log(produtosVendaTemporario[index]);
        

        if(produtosVendaTemporario[index].nome!==''){
            
            adicionarProduto(produtosVendaTemporario[index]);
        }
        setProdutosVenda(produtosVendaTemporario); 
        

    }

    async function adicionarProduto(dados:FormularioVendasProdutosProps) {
        try {
            await vendasDatabase.criarVendaProduto({produto_id:dados.produto_id,quantidade:dados.quantidade,venda_id:dados.venda_id});
            
            setProdutosVenda([...produtosVenda,{venda_id:Number(id),produto_id:0,nome:'',preco:0,quantidade:0}]);
            
            Alert.alert('Produto adicionado.');
            listar();
            
        } catch (error) {
            console.log(error);
        }
    }


    async function atualizarValor(produtosVendidos:FormularioVendasProdutosProps[]){
        let valor_total = 0;
        //console.log(produtosVendidos);
        for(let i=0;i<produtosVendidos.length;i++){
            if((produtosVendidos[i].preco!==0) || produtosVendidos[i].quantidade!==0){
                valor_total += (produtosVendidos[i].preco*produtosVendidos[i].quantidade);
            }
            
        }
        //console.log(valor_total);
        await vendasDatabase.atualizarValorTotal(produtosVendidos[0].venda_id,valor_total);
    }

    function confirmarExclusao(id:number){
        Alert.alert("Aviso",'Deseja exluir o produto?', [
            {
                text:"Não",
                onPress: ()=> listar()
            },
            {
                text:"Sim",
                onPress:()=> apagarProduto(id)
            }
        ]);
    }

    function confirmarAdicao(id:number,quantidade:string){

        Alert.alert("Aviso","Deseja confimar a alteração ?", [
            {
                text:"Não",
                onPress:()=>listar()
            },
            {
                text:"Sim",
                onPress: ()=> alterarQuantidade(id,quantidade)
            }
        ]);
    }

    function onFocusQuantidade(index:number){
        let dropdownQuantidade = [...campoDropdownQuantidade];
        dropdownQuantidade[index] = true;
        setCampoDropdownQuantidade(dropdownQuantidade);

    }

    function onBlurQuantidade(index:number){
        let dropdownQuantidade = [...campoDropdownQuantidade];
        dropdownQuantidade[index] = false;
        setCampoDropdownQuantidade(dropdownQuantidade);
    }

    useEffect(()=>{
        listar();
    },[id])

    return(
        <View style={{flex:1,backgroundColor:"#451a03"}}>
            <ExpoStatusBar backgroundColor="#451a03" style="light"/>
            <StatusBar/>

            <View style={style.cabecalho}>
            <Pressable onPress={()=> router.back()} style={{marginBottom:5}}>
                <FontAwesome name="chevron-left" size={22} color="white" />
            </Pressable>
            <Text style={style.titulo}>Editar Produtos</Text>
            <TouchableOpacity style={{marginBottom:5}}  onPress={()=> setModalVisivel(true)}> 
                <MaterialIcons name="production-quantity-limits" size={20} color="#fff" />
            </TouchableOpacity>
        </View>

        <ModalQuantidade setQuantidadesSemZero={setQuantidadesSemZero} modalVisivel={modalVisivel} setModalVisivel={setModalVisivel} quantidadesComZero={quantidadesComZero} quantidadesSemZero={quantidadesComZero} setQuantidadesComZero={setQuantidadesComZero}/>

            <KeyboardAwareScrollView style={style.container} >
                <ScrollView  style={style.form}>
                    
                
                    
                    {produtosVenda.length>0 &&
                        produtosVenda.map((produto,index)=>{
                            
                            if(index===produtosVenda.length-1){
                                return(
                                    <View key={index}>
                                        <Text  style={style.label}>Produto {index+1}</Text>
                                        <Dropdown data={listaProdutos}
                                        labelField="nome"
                                        valueField="id"
                                        style={[style.dropdown, campoDropdownCliente && {borderColor: "#f472b6" ,borderWidth:2}]}
                                        onChange={produto => escolherProduto(produto,index) }
                                        placeholder="Selecione um produto"
                                        excludeItems={listaProdutosSelecionados}
                                        onFocus={()=> setCampoDropdownCliente(true)}
                                        onBlur={()=> setCampoDropdownCliente(false)}
                                        
                                        />


                                        <Text style={style.label}>Quantidade</Text>

                                        <Dropdown data={quantidadesSemZero}
                                        labelField="quantidade" valueField="quantidade"
                                        onChange={item=> quantidadeNovoProduto(item,index)}
                                        placeholder="Selecione a quantidade"
                                        value={String(produtosVenda[index].quantidade)}
                                        onFocus={()=> onFocusQuantidade(index)}
                                        onBlur={()=> onBlurQuantidade(index)}
                                        style={[style.dropdown, campoDropdownQuantidade[index] && { borderColor: '#f472b6',borderWidth:2 }]}

                                        />

                                    </View>
                                )
                            }
                            return (
                                <View key={index}>
                                    <Text  style={style.label}>Produto {index+1}</Text>
                                    <TextInput value={produto.nome} style={style.input} editable={false}/>
                                    <Text style={style.label}>Quantidade</Text>
                                    {/* <TextInput value={String(produto.quantidade)} style={style.input} /> */}
                                    <Dropdown data={produtosVenda.length==2 ? quantidadesSemZero: quantidadesComZero} 
                                    labelField="quantidade" 
                                    onChange={item => {
                                        item.quantidade=="0 (Excluir)" ? confirmarExclusao(produto.produto_id) : 
                                        confirmarAdicao(produto.produto_id,item.quantidade);
                                    }}

                                    value={String(produtosVenda[index].quantidade)}

                                    valueField="quantidade"
                                    style={[style.dropdown, campoDropdownQuantidade[index] && { borderColor: '#f472b6',borderWidth:2 }]}

                                    onFocus={()=> onFocusQuantidade(index)}
                                    onBlur={()=> onBlurQuantidade(index)}
                                    />
                                </View>
                            )
                            
                        })
                        
                    }
                    

                </ScrollView>
            </KeyboardAwareScrollView>
            
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        padding:5,
        borderTopLeftRadius:20,
        borderTopRightRadius:20, 
        backgroundColor:"#fdf2f8",
        

        borderColor: "white",
        
        // borderBottomEndRadius:20,
        // borderBottomStartRadius:20,
    
        // Sombras para iOS
        shadowColor: '#fff',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    form:{
        marginBottom:80,
        backgroundColor:"#fff",
        padding:25,
        borderRadius:20,
        marginTop:15,
    },
    input:{
        width: '100%',
        height: 40,
        borderColor: "#e5e7eb", 
        borderWidth: 1,      
        borderRadius: 5,     
        paddingHorizontal: 10,
        backgroundColor: "white",
        marginTop:5,
        
        
    },
    label:{
        fontWeight:"bold",
        marginTop: 10,
        color:"#451a03"
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop:5,
        backgroundColor:"#fff",
        paddingLeft:10
      },
      modal:{
        width:"80%",
        backgroundColor:"#fff",
        position:"absolute",
        top:"40%",
        left:"10%",
        borderRadius:20,
        borderColor: "#f472b6", 
        borderWidth: 1,   
        zIndex:100,
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
        top:10
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
    titulo:{
        color:"#fff",
        fontSize:16,
        fontWeight:"bold",
        marginBottom:10
    }
});
