import { Href, router, useLocalSearchParams } from "expo-router";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { ScrollView, View, StyleSheet, Pressable, Text, TextInput, Platform, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";
import { ClienteOuProdutosDatabaseProps, useClienteOuProdutoDatabase } from "../database/useClienteOuProdutoDatabase";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { EditarFormularioVendaProps, useVendasDatabase } from "../database/useVendasDatabase";
import  RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export default function EditarVenda(){
    const {id} = useLocalSearchParams<{id:string}>();
    const [listaClientes,setListaClientes] = useState<ClienteOuProdutosDatabaseProps[]>([]);
    const [formularioVenda,setFormularioVenda] = useState<EditarFormularioVendaProps>({
        id:0,
        id_cliente: 0,
        nome_cliente:'',
        data_pedido: new Date(),
        data_entrega: new Date(),
        tema_festa: '',
        nome_aniversariante: '',
        idade_completar: 0,
        valor_entrada: 0,
        valor_total: 0,
        data_pagamento_restante: new Date(),
        metodo_pagamento: '',
        observacoes: '',
        status_entrega: false
    });
    const [clienteSelecionado,setClienteSelecionado] = useState<{id:number,nome:string}>();

    const [exibirDataEntrega,setExibirDataEntrega] = useState(false);
    const [exibirDataPagamentoRestante,setExibirDataPagamentoRestante] = useState(false);

    const [campoDropdownCliente, setCampoDropdownCliente] = useState(false);
    const [campoDropdownMetodoPagamento, setCampoDropdownMetodoPagamento] = useState(false);

    const [campoTemaFesta,setCampoTemaFesta] = useState(false);
    const [campoNomeAniversariante,setCampoNomeAniversariante] = useState(false);
    const [campoIdadeCompletar,setCampoIdadeCompletar] = useState(false);
    const [campoValorEntrada,setCampoValorEntrada] = useState(false);
    const [campoObservacoes,setCampoObservacoes] = useState(false);

    const nomeAniversarianteRef = useRef<TextInput>(null);
    const idadeCompletarRef = useRef<TextInput>(null); 
    const valorEntradaRef = useRef<TextInput>(null); 

    const clientesOuProdutosDatabase = useClienteOuProdutoDatabase();
    const vendasDatabase = useVendasDatabase();

    function trocarExibicaoDataEntrega(){
        setExibirDataEntrega(!exibirDataEntrega);
    }

    function trocarExibicaoDataRestante(){
        setExibirDataPagamentoRestante(!exibirDataPagamentoRestante);
    }



    function onChangeDataEntrega({type}:DateTimePickerEvent,selectedDate?:Date){
        if(type=="set"){
            setExibirDataEntrega(false);
            const dataEntrega = selectedDate || new Date(formularioVenda.data_entrega);
            if(dataEntrega<formularioVenda.data_pagamento_restante){
                setFormularioVenda(estado=> ({...estado, data_entrega:dataEntrega,data_pagamento_restante:dataEntrega}));
            }else{
                setFormularioVenda(estado=> ({...estado, data_entrega:dataEntrega}));
            }
            
        }else{
            trocarExibicaoDataEntrega();
        }
    }

    function onChangeDataPagamentoRestante({type}:DateTimePickerEvent,selectedDate?:Date){
        if(type=="set"){
            setExibirDataPagamentoRestante(false);
            const dataEntrega = selectedDate || new Date(formularioVenda.data_entrega);
            setFormularioVenda(estado=> ({...estado, data_pagamento_restante:dataEntrega}));
        }else{
            trocarExibicaoDataRestante();
        }
    }

    async function listar() {
        let listaCliente = await clientesOuProdutosDatabase.procurarClientePeloNome('');
        let formulario = await vendasDatabase.formularioVenda(Number(id));
        setListaClientes(listaCliente);
        if(formulario){
            //console.log(formulario)
            setClienteSelecionado({id: formulario.id_cliente,nome:formulario.nome_cliente});
            
            setFormularioVenda({
                id:formulario.id,
                id_cliente: formulario.id_cliente,
                nome_cliente:formulario.nome_cliente,
                data_pedido: new Date(formulario.data_pedido+"T00:00:00"),
                data_entrega: new Date(formulario.data_entrega+"T00:00:00"),
                tema_festa: formulario.tema_festa,
                nome_aniversariante: formulario.nome_aniversariante,
                idade_completar: formulario.idade_completar,
                valor_entrada: formulario.valor_entrada,
                valor_total: formulario.valor_total,
                data_pagamento_restante: new Date(formulario.data_pagamento_restante+"T00:00:00"),
                metodo_pagamento: formulario.metodo_pagamento,
                observacoes: formulario.observacoes,
                status_entrega: formulario.status_entrega
            });
        }
        
    }


    async function salvarEdicao() {
        try {
            await vendasDatabase.editarVenda(formularioVenda);
            router.push({pathname:'/visualizarVenda',params:{id}});
            Alert.alert("Aviso","Os dados da venda foi alterado.");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        listar()
    },[id]);

    


 
    return(
        <View style={{flex:1,backgroundColor:"#451a03"}}>
            <ExpoStatusBar backgroundColor='#451a03' style="light"/>
            <View style={style.barraNavegacao}>
                <Pressable onPress={()=> router.back()}>
                    <FontAwesome name="chevron-left" size={22} color="white" />
                </Pressable>
                <TouchableOpacity style={style.botaoEditar} onPress={()=> router.navigate('/editarVendaProdutos/'+id as Href) }>
                    <Text style={style.tituloBotaoEditar}>Editar Produtos</Text>
                </TouchableOpacity>
            </View>
            
                
                    <View style={style.container}>
                        <View style={style.containerForm}>
                        <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>

                        
                        
                            <View style={style.form}>
                            <KeyboardAwareScrollView >
                            <ScrollView>
                            
                            <Text style={style.label}>Cliente</Text> 
                            <Dropdown data={listaClientes}
                            labelField="nome"
                            valueField="id"
                            onChange={item => {setFormularioVenda(estado=> ({...estado,id_cliente:item.id,nome_cliente:item.nome}))}}
                            value={clienteSelecionado}
                            style={[style.dropdown, campoDropdownCliente && { borderColor: '#f472b6',borderWidth:2 }]}
                            onFocus={()=> setCampoDropdownCliente(true)} onBlur={()=> setCampoDropdownCliente(false)}

                            />
                            


                            <Text style={style.label}>Data da Entrega</Text> 

                            {Platform.OS=="android" &&
                                <>
                                    <Pressable onPress={trocarExibicaoDataEntrega}>
                                        <TextInput value={new Date(formularioVenda.data_entrega).toLocaleString("pt-BR").split(',')[0]} style={style.input} editable={false}/>
                                    </Pressable>

                                    {exibirDataEntrega && 
                                        <RNDateTimePicker value={new Date(formularioVenda.data_entrega)} mode="date" onChange={onChangeDataEntrega} timeZoneName={"BR"} minimumDate={formularioVenda.data_pedido}/>
                                    }
                                </>
                            }

                            {Platform.OS=="ios" && 
                                <>
                                    <Pressable  style={{position:"relative"}}>
                                        <TextInput value={new Date(formularioVenda.data_entrega).toLocaleString("pt-BR").split(',')[0]} style={style.input} editable={false} />
                                        <RNDateTimePicker value={new Date(formularioVenda.data_entrega)} mode="date" onChange={onChangeDataEntrega} timeZoneName={"BR"} style={style.calendarioIOS} minimumDate={formularioVenda.data_pedido}/>
                                    </Pressable>
                                </>
                            }

                            <Text style={style.label}>Tema da festa</Text>
                            <TextInput value={formularioVenda.tema_festa} style={campoTemaFesta ? style.input_selecionado :style.input} onFocus={()=> setCampoTemaFesta(true)} onBlur={()=> setCampoTemaFesta(false)} placeholder="Tema da festa" placeholderTextColor="gray" onChangeText={tema_festa => setFormularioVenda(estado => ({...estado,tema_festa}))} onSubmitEditing={()=> nomeAniversarianteRef.current?.focus()} returnKeyType="next"/>
                            
                            <Text style={style.label}>Nome do aniversariante</Text>
                            <TextInput value={formularioVenda.nome_aniversariante} ref={nomeAniversarianteRef} style={campoNomeAniversariante ? style.input_selecionado :style.input} onFocus={()=> setCampoNomeAniversariante(true)} onBlur={()=> setCampoNomeAniversariante(false)} placeholder="Nome do aniversariante" placeholderTextColor="gray" onChangeText={nome_aniversariante => setFormularioVenda(estado => ({...estado,nome_aniversariante}))} onSubmitEditing={()=> idadeCompletarRef.current?.focus()} returnKeyType="next"/>

                            <Text style={style.label}>Idade a completar</Text>
                            <TextInput value={String(formularioVenda.idade_completar)} ref={idadeCompletarRef} style={campoIdadeCompletar ? style.input_selecionado :style.input}  onFocus={()=> setCampoIdadeCompletar(true)} onBlur={()=> setCampoIdadeCompletar(false)} keyboardType="number-pad"  placeholder="Idade á completar" placeholderTextColor="gray" onChangeText={idade_completar => setFormularioVenda(estado => ({...estado,idade_completar: Number(idade_completar)}))} onSubmitEditing={()=> valorEntradaRef.current?.focus()} returnKeyType="next"/>

                            <Text style={style.label}>Valor pago na entrada</Text>
                            <TextInput value={String(formularioVenda.valor_entrada)} ref={valorEntradaRef} style={campoValorEntrada ? style.input_selecionado :style.input} onFocus={()=> setCampoValorEntrada(true)} onBlur={()=> setCampoValorEntrada(false)} keyboardType="number-pad"  placeholder="Valor pago na entrada" placeholderTextColor="gray" onChangeText={valor_entrada => setFormularioVenda(estado => ({...estado,valor_entrada: Number(valor_entrada)}))}/>

                            <Text style={style.label}>Valor Total</Text>
                            <TextInput value={String(formularioVenda.valor_total)} style={style.input} editable={false}/>

                            <Text style={style.label}>Data do pagamento do restante</Text>
                            {Platform.OS=="android" &&
                                <>
                                    <Pressable onPress={trocarExibicaoDataRestante}>
                                        <TextInput value={new Date(formularioVenda.data_pagamento_restante).toLocaleString("pt-BR").split(',')[0]} style={style.input} editable={false} />
                                    </Pressable>

                                    {exibirDataPagamentoRestante && 
                                        <RNDateTimePicker value={new Date(formularioVenda.data_pagamento_restante)} mode="date" onChange={onChangeDataPagamentoRestante} timeZoneName={"BR"} minimumDate={formularioVenda.data_pedido} maximumDate={formularioVenda.data_entrega} />
                                    }
                                </>
                            }

                            {Platform.OS=="ios" && 
                                <>
                                    <Pressable  style={{position:"relative"}}>
                                        <TextInput value={new Date(formularioVenda.data_pagamento_restante).toLocaleString("pt-BR").split(',')[0]} style={style.input} editable={false} />
                                        <RNDateTimePicker value={new Date(formularioVenda.data_pagamento_restante)} mode="date" onChange={onChangeDataPagamentoRestante} timeZoneName={"BR"} style={style.calendarioIOS} minimumDate={formularioVenda.data_pedido} maximumDate={formularioVenda.data_entrega}/>
                                    </Pressable>
                                </>
                            }

                            <Text style={style.label}>Método de Pagamento</Text>
                            <Dropdown data={[{tipo_pagamento:"Cartão"},{tipo_pagamento:"Dinheiro"},{tipo_pagamento:"Pix"}]} 
                            placeholder={!formularioVenda.metodo_pagamento ? 'Método de Pagamento' : '...'} labelField="tipo_pagamento" valueField="tipo_pagamento"
                            value={formularioVenda.metodo_pagamento}
                            onChange={item => setFormularioVenda(estado=> ({...estado,metodo_pagamento:item.tipo_pagamento}))}
                            style={[style.dropdown, campoDropdownMetodoPagamento && { borderColor: '#f472b6',borderWidth:2 }]}
                            onFocus={()=> setCampoDropdownMetodoPagamento(true)} onBlur={()=> setCampoDropdownMetodoPagamento(false)}
                            />

                            <Text style={style.label}>Observações</Text>
                            <TextInput placeholderTextColor="gray" style={campoObservacoes ? style.input_selecionado :style.input} onFocus={()=> setCampoObservacoes(true)} onBlur={()=> setCampoObservacoes(false)} multiline numberOfLines={4} placeholder="Observações"  value={formularioVenda.observacoes} onChangeText={(observacoes)=> setFormularioVenda(estado=>({...estado,observacoes}))}/>

                            <TouchableOpacity style={style.botaoSalvar} onPress={salvarEdicao}>
                                <Text style={style.textoBotaoSalvar}>Salvar</Text>
                            </TouchableOpacity>
                            </ScrollView>
                            </KeyboardAwareScrollView>
                            </View>
                            </TouchableWithoutFeedback>
                            </View>
                            
                            

                        </View>
                    
            
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#451a03",
        
    },
    barraNavegacao:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"flex-end",
        paddingHorizontal:30,
        paddingBottom:10,
        backgroundColor: '#451a03',
        height:110,
        
        borderColor: "white",
    
        // Sombras para iOS
        shadowColor: '#fff',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop:5
      },
    label:{
        fontWeight:"bold",
        marginTop: 10
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
    input_selecionado:{
        borderColor: "rgb(216, 27, 96)",
        width: '100%',
        height: 40,
        borderWidth: 1,      
        borderRadius: 5,     
        paddingHorizontal: 10,
        backgroundColor: "white", 
    },
    inputCalendario:{
        width: '100%',
        height: 40,
        borderColor: "#e5e7eb", 
        borderWidth: 1,      
        borderRadius: 5,     
        paddingHorizontal: 10,
        backgroundColor: "white",
        marginTop:5,
        position:"relative"
    },
    calendarioIOS:{
        position:"absolute",
        top:10,
        left:-5,
        opacity:0.1
    },
    form:{
        backgroundColor:"#fff",
        paddingBottom:40,
        width:"100%",
        padding: 25,
        gap: 10,
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
    
    
    tituloBotaoEditar:{
        color:"#451a03",
        fontSize:14,
        fontWeight:"bold"
    },
    botaoEditar:{
        padding:5,
        borderColor: "white",
        borderWidth:1,
        borderRadius:50,
        backgroundColor:"#fff",
        // Sombras para iOS
        shadowColor: '#fff',         // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
        shadowOpacity: 0.25,         // Opacidade da sombra
        shadowRadius: 3.84,          // Raio de desfoque da sombra
        
        // Sombras para Android
        elevation: 5,                // Elevação da sombra
    },
    containerForm:{
        backgroundColor:"#fdf2f8",
        flex:1,
        padding:5,
        borderTopEndRadius:20,
        borderTopStartRadius:20,
    },
    textoBotaoSalvar:{
        color:"#fff",
        textAlign:"center",
        fontSize:18,
        fontWeight:"bold"
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
});