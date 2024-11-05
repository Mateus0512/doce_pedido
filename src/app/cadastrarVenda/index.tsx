import { useEffect,useRef,useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Platform,  ScrollView, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StatusBar} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { ClienteOuProdutosDatabaseProps, useClienteOuProdutoDatabase } from "../database/useClienteOuProdutoDatabase";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import { FormularioVendasProdutosProps, useVendasDatabase, FormularioVendaProps } from "../database/useVendasDatabase";
import { FontAwesome,MaterialIcons } from "@expo/vector-icons";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { ModalQuantidade } from "@/componentes/modalQuantidade";


interface ProdutosDatabaseProps extends ClienteOuProdutosDatabaseProps {
    id: number
}

export default function CadastrarVenda(){
    
    const [listaClientes,setListaClientes] = useState<ClienteOuProdutosDatabaseProps[]>([]);
    const [listaProdutos,setListaProdutos] = useState<ProdutosDatabaseProps[]>([]);
    const [listaProdutosSelecionados,setListaProdutosSelecionados] = useState<ProdutosDatabaseProps[]>([])

    const [campoDropdownCliente, setCampoDropdownCliente] = useState(false);
    const [campoDropdownMetodoPagamento, setCampoDropdownMetodoPagamento] = useState(false);

    const [exibirDataPedido, setExibirDataPedido] = useState(false);
    const [exibirDataEntrega,setExibirDataEntrega] = useState(false);
    const [exibirDataPagamentoRestante,setExibirDataPagamentoRestante] = useState(false);

    const [campoTemaFesta,setCampoTemaFesta] = useState(false);
    const [campoNomeAniversariante,setCampoNomeAniversariante] = useState(false);
    const [campoIdadeCompletar,setCampoIdadeCompletar] = useState(false);
    const [campoDropdownProdutos,setCampoDropdownProdutos] = useState<boolean[]>([false]);
    const [campoDropdownQuantidade,setCampoDropdownQuantidade] = useState<boolean[]>([false]);
    const [campoValorEntrada,setCampoValorEntrada] = useState(false);
    const [campoObservacoes,setCampoObservacoes] = useState(false);

    const [modalVisivel,setModalVisivel] = useState(false);

    const [quantidadesSemZero,setQuantidadesSemZero] = useState([{quantidade:"1"},{quantidade:"2"},{quantidade:"3"}
        ,{quantidade:"4"},{quantidade:"5"},{quantidade:"6"},{quantidade:"7"},{quantidade:"8"},{quantidade:"9"}]);
    
    const [quantidadesComZero,setQuantidadesComZero] = useState([{quantidade: "0 (Excluir)"},{quantidade:"1"},{quantidade:"2"},{quantidade:"3"}
        ,{quantidade:"4"},{quantidade:"5"},{quantidade:"6"},{quantidade:"7"},{quantidade:"8"},{quantidade:"9"}
    ]);


    const nomeAniversarianteRef = useRef<TextInput>(null);
    const idadeCompletarRef = useRef<TextInput>(null); 


    const clientesOuProdutosDatabase = useClienteOuProdutoDatabase();
    const vendasDatabase = useVendasDatabase();

    //Campos do formulario
    const [formularioVenda,setFormularioVenda] = useState<FormularioVendaProps>({
        id:0,
        id_cliente: 0,
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

    const [formularioVendaProduto,setFormularioVendaProduto] = useState<FormularioVendasProdutosProps[]>([
        {produto_id:0,quantidade:0,venda_id:0,nome:'', preco:0 }
    ]);

    const [precoEntrada,setPrecoEntrada] = useState('');
    

      function trocarExibicaoDataPedido(){
        setExibirDataPedido(!exibirDataPedido);

      }

      function trocarExibicaoDataEntrega(){
        setExibirDataEntrega(!exibirDataEntrega);
      }

      function onChangeDataPedido({type}:DateTimePickerEvent,selectedDate?:Date){
        if(type=="set"){
            setExibirDataPedido(false);
            //console.log(selectedDate)
            const currentDate = selectedDate || formularioVenda.data_pedido;
            setFormularioVenda(estado=>({...estado,data_pedido:currentDate,data_entrega:currentDate,data_pagamento_restante:currentDate}));

        }else{
            trocarExibicaoDataPedido();
        }
      }

      function onChangeDataEntrega({type}:DateTimePickerEvent,selectedDate?:Date){
        if(type=="set"){
            setExibirDataEntrega(false);
            const Entrega = selectedDate || formularioVenda.data_entrega;
            setFormularioVenda(estado=>({...estado,data_entrega:Entrega,data_pagamento_restante:Entrega}));
            
        }else{
            trocarExibicaoDataEntrega();
        }
      }

      function trocarExibicaoDataRestante(){
        setExibirDataPagamentoRestante(!exibirDataPagamentoRestante);
      }

      function onChangeDataPagamentoRestante({type}:DateTimePickerEvent,selectedDate?:Date){
        if(type=="set"){
            setExibirDataPagamentoRestante(false);
            const pagamentoRestante = selectedDate || formularioVenda.data_pagamento_restante;
            setFormularioVenda(estado => ({...estado,data_pagamento_restante:pagamentoRestante}));
        }else{
            trocarExibicaoDataRestante();
        }
        
      }

      function selecionarProduto(item:ProdutosDatabaseProps,index:number){
        //console.log(item);
        setListaProdutosSelecionados([...listaProdutosSelecionados,{id:item.id,nome:item.nome,preco:item.preco}]);
        let formularioVendaProdutosTemporario:FormularioVendasProdutosProps[] = [...formularioVendaProduto];
        if((item.id!==0)&&(item.nome!=="")&&(item.preco)){
            formularioVendaProdutosTemporario[index] = {...formularioVendaProdutosTemporario[index],produto_id:item.id,nome:item.nome,preco:item.preco};
            setFormularioVendaProduto(formularioVendaProdutosTemporario);
            if(formularioVendaProdutosTemporario[index].quantidade!==0){
                calculaTotal(formularioVendaProdutosTemporario);
                if((formularioVendaProdutosTemporario[formularioVendaProdutosTemporario.length-1].produto_id!==0)&&(formularioVendaProdutosTemporario[formularioVendaProdutosTemporario.length-1].quantidade!==0)){
                    formularioVendaProdutosTemporario.push({produto_id:0,quantidade:0,venda_id:0,nome:'', preco:0 });
                    setFormularioVendaProduto(formularioVendaProdutosTemporario);
                }
            }
        }
      }

      function selecionarQuantidade(valor:{quantidade:string},index:number){
        let formularioVendaProdutosTemporario:FormularioVendasProdutosProps[] = [...formularioVendaProduto];
        let listaProdutosSelecionadosTemporaria:ProdutosDatabaseProps[] = [...listaProdutosSelecionados];
        if(valor.quantidade=="0 (Excluir)"){
            formularioVendaProdutosTemporario.splice(index,1);
            listaProdutosSelecionadosTemporaria.splice(index,1);
            calculaTotal(formularioVendaProdutosTemporario);
            setListaProdutosSelecionados(listaProdutosSelecionadosTemporaria);
            setFormularioVendaProduto(formularioVendaProdutosTemporario);
        }
        else{
            formularioVendaProdutosTemporario[index] = {...formularioVendaProdutosTemporario[index],quantidade:Number(valor.quantidade)}
            setFormularioVendaProduto(formularioVendaProdutosTemporario);
            if((formularioVendaProdutosTemporario[index].produto_id!==0)&&(formularioVendaProdutosTemporario[index].nome!=="")&&(formularioVendaProdutosTemporario[index].preco)){
                calculaTotal(formularioVendaProdutosTemporario);
                if((formularioVendaProdutosTemporario[formularioVendaProdutosTemporario.length-1].produto_id!==0)&&(formularioVendaProdutosTemporario[formularioVendaProdutosTemporario.length-1].quantidade!==0)){
                    formularioVendaProdutosTemporario.push({produto_id:0,quantidade:0,venda_id:0,nome:'', preco:0 });
                    setFormularioVendaProduto(formularioVendaProdutosTemporario);
                }
            }
        }

        }

        // function adicionarQuantidade(){
        //     //console.log(index,quantidadeNova);
        //     let quantidadesComZeroTemporario = [...quantidadesComZero];
        //     let quantidadesSemZeroTemporario = [...quantidadesSemZero];
        //     quantidadesComZeroTemporario[quantidadesComZeroTemporario.length-1] = {quantidade:String(quantidadeNova)}
        //     quantidadesComZeroTemporario[quantidadesComZeroTemporario.length] = {quantidade:"Mais..."}
        //     quantidadesSemZeroTemporario[quantidadesSemZeroTemporario.length-1] = {quantidade:String(quantidadeNova)}
        //     quantidadesSemZeroTemporario[quantidadesSemZeroTemporario.length] = {quantidade:"Mais..."}
        //     setQuantidadesComZero(quantidadesComZeroTemporario);
        //     setQuantidadesSemZero(quantidadesSemZeroTemporario);
            

        //     setModalVisivel(false);

        // }


      function calculaTotal(formulario:FormularioVendasProdutosProps[]){

            let valor_total = 0;

            formulario.map(item=>{
                valor_total+= (item.preco*item.quantidade);
            });

            valor_total = Number(valor_total.toFixed(2));
            

            setFormularioVenda(estado=> ({...estado,valor_total}));

      }

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

         setFormularioVenda(estado=>({...estado,valor_entrada:parseFloat(Number(formatValue).toFixed(2))}))

         setPrecoEntrada(formattedValue);
       }

       function onFocusCampoDropdownProdutos(index:number){
            let produtosFocados = [...campoDropdownProdutos];
            produtosFocados[index] = true;
            setCampoDropdownProdutos(produtosFocados);
       }

       function onBlurCampoDropdownProdutos(index:number){
        let produtosFocados = [...campoDropdownProdutos];
        produtosFocados[index] = false;
        setCampoDropdownProdutos(produtosFocados);
        }

        function onFocusCampoDropdownQuantidade(index:number){
            let quantidadeFocados = [...campoDropdownQuantidade];
            quantidadeFocados[index] = true;
            setCampoDropdownQuantidade(quantidadeFocados);
       }

       function onBlurCampoDropdownQuantidade(index:number){
        let quantidadeFocados = [...campoDropdownQuantidade];
        quantidadeFocados[index] = false;
        setCampoDropdownQuantidade(quantidadeFocados);
        }


      function testarQuantidades(){

        if(formularioVenda.id_cliente==0){
            Alert.alert("Aviso","Por favor, selecione um cliente para continuar.");
            return;
        }
        else if(formularioVenda.valor_total==0){
            Alert.alert("Aviso","Por favor, selecione um produto e a quantidade para continuar.");
            return;
        }
        else if(formularioVenda.metodo_pagamento==""){
            Alert.alert("Aviso","Por favor, selecione o método de pagamento para continuar.");
            return;
        }


        let temDuplicata = [];

        for(let i=0;i<formularioVendaProduto.length;i++){
            for(let ii=i+1;ii<formularioVendaProduto.length;ii++){
                if(formularioVendaProduto[i].produto_id === formularioVendaProduto[ii].produto_id){
                    temDuplicata.push({ids_iguais: formularioVendaProduto[i].produto_id,primeiro_indice: i, segundo_indice:ii}) ;
                }
            }
        }

        if(temDuplicata.length>0){
            Alert.alert('Itens duplicados','Deseja somar as quantidades ?',[
                {
                    text: "Cancelar",
                    onPress: () => {}
                },
                {
                    text: "Sim", onPress: () => {
                        let formularioTemporario = [...formularioVendaProduto];

                        if(formularioTemporario[formularioTemporario.length-1].nome=='' || formularioTemporario[formularioTemporario.length-1].quantidade==0){
                            formularioTemporario.splice(formularioTemporario.length-1,1);
                        }

                        temDuplicata.map((item,index)=>{
                        formularioTemporario[item.primeiro_indice].quantidade = formularioTemporario[item.primeiro_indice].quantidade+ formularioTemporario[item.segundo_indice-index].quantidade;
                        formularioTemporario.splice(item.segundo_indice-index,1);
                    })
                    
                    //console.log(formularioTemporario);
                    
                    //salvar(formularioTemporario);
                    
                    }
                }
            ])
        }else{
            //salvar(formularioVendaProduto);
        }

        
      }

      async function salvar() {
        if(formularioVenda.id_cliente==0){
            Alert.alert("Aviso","Por favor, selecione um cliente para continuar.");
            return;
        }
        else if(formularioVenda.valor_total==0){
            Alert.alert("Aviso","Por favor, selecione um produto e a quantidade para continuar.");
            return;
        }
        else if(formularioVenda.metodo_pagamento==""){
            Alert.alert("Aviso","Por favor, selecione o método de pagamento para continuar.");
            return;
        }

        try {
            //setFormularioVenda(estado=>({...estado,valor_entrada:parseFloat(Number(precoEntrada).toFixed(2))}))
            const idVenda = await vendasDatabase.criarVenda({id_cliente:formularioVenda.id_cliente,data_pedido:formularioVenda.data_pedido,data_entrega:formularioVenda.data_entrega,tema_festa:formularioVenda.tema_festa,nome_aniversariante:formularioVenda.nome_aniversariante,idade_completar:formularioVenda.idade_completar,valor_entrada:Number(precoEntrada),valor_total:formularioVenda.valor_total,data_pagamento_restante: formularioVenda.data_pagamento_restante ,metodo_pagamento:formularioVenda.metodo_pagamento,observacoes:formularioVenda.observacoes,status_entrega:false});
            //console.log(formularioVendaProduto);

            // formularioProdutos.map(item=>{
                
            //     if(item.produto_id>0 && item.quantidade>0){
            //         //console.log(item.produto_id, item.quantidade, idVenda.insertedRow);
            //         vendasDatabase.criarVendaProduto({produto_id:item.produto_id,quantidade:item.quantidade,venda_id:Number(idVenda.insertedRow)});
            //     }
                
            // })

            formularioVendaProduto.map(item=>{
                if(item.produto_id>0 && item.quantidade>0){
                    vendasDatabase.criarVendaProduto({produto_id:item.produto_id,quantidade:item.quantidade,venda_id:Number(idVenda.insertedRow)});
                }
            });

            Alert.alert("Venda cadastrada.");
            router.back();
        } catch (error) {
            console.log(error);
        }
      }

    useEffect(()=>{
        listar();
    },[]);

    async function listar() {
        let listaCliente = await clientesOuProdutosDatabase.procurarClientePeloNome('');
        let listaProduto = await clientesOuProdutosDatabase.procurarProdutoPeloNome('');
        setListaClientes(listaCliente);
        setListaProdutos(listaProduto);

    }
    return(
        
        <View style={{flex:1, backgroundColor:"#451a03"}}>  
        
        <ExpoStatusBar backgroundColor="#451a03" style="light"/>
        <StatusBar/>

        <View style={style.cabecalho}>
            <Pressable onPress={()=> router.back()} style={{marginBottom:5}}>
                <FontAwesome name="chevron-left" size={22} color="white" />
            </Pressable>
            <Text style={style.titulo}>Cadastrar Venda</Text>
            <TouchableOpacity style={{marginBottom:5}}  onPress={()=> setModalVisivel(true)}> 
                <MaterialIcons name="production-quantity-limits" size={20} color="#fff" />
            </TouchableOpacity>
        </View>

        <ModalQuantidade setQuantidadesSemZero={setQuantidadesSemZero} modalVisivel={modalVisivel} setModalVisivel={setModalVisivel} quantidadesComZero={quantidadesComZero} quantidadesSemZero={quantidadesComZero} setQuantidadesComZero={setQuantidadesComZero}/>
            
            
            
            <View style={style.container}>
            
                <View style={style.form}>
                <KeyboardAwareScrollView>
            
                <ScrollView  >
                    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                    <View style={style.espacamentoForm}>

                    
                    
                    <Dropdown data={listaClientes} labelField="nome" valueField="id"  search 
                    onChange={item => {
                    setFormularioVenda(estado=>({...estado,id_cliente:item.id}));
                    }}
                    
                    placeholder={!campoDropdownCliente ? 'Nome do cliente' : '...'}
                    searchPlaceholder="Digite o nome do cliente"
                    maxHeight={300}
                    style={[style.dropdown, campoDropdownCliente && { borderColor: '#f472b6',borderWidth:2 }]}
                    onFocus={()=>setCampoDropdownCliente(true)}
                    onBlur={()=>setCampoDropdownCliente(false)}
                    />
                    <Text>Data do pedido</Text>

                    {Platform.OS==="android" &&
                    <>
                        <Pressable onPress={trocarExibicaoDataPedido}>
                        <TextInput style={style.input} value={formularioVenda.data_pedido.toLocaleString("pt-BR").split(',')[0]} placeholder="Data do pedido" editable={false} onPressIn={trocarExibicaoDataPedido}/>
                        </Pressable>
                        {exibirDataPedido &&
                        <DateTimePicker mode="date" value={formularioVenda.data_pedido}  display="calendar" onChange={onChangeDataPedido} timeZoneName={"BR"}  />

                        }
                    </>
                    }

                    {Platform.OS==="ios" &&
                        <Pressable style={{position:"relative"}}>
                        <TextInput style={style.input} value={formularioVenda.data_pedido.toLocaleString("pt-BR").split(',')[0]} placeholder="Data do pedido" editable={false} onPressIn={trocarExibicaoDataPedido}/>
                        <DateTimePicker mode="date" value={formularioVenda.data_pedido}  style={style.inputCalendario} display="calendar" onChange={onChangeDataPedido} timeZoneName={"BR"}  />
                        </Pressable>
                        
                    }

                    
                    <Text>Data da Entrega</Text> 

                    {Platform.OS==="android" &&
                        <>
                            <Pressable onPress={trocarExibicaoDataEntrega}>
                            <TextInput style={style.input} value={formularioVenda.data_entrega.toLocaleString("pt-BR").split(',')[0]} placeholder="Data da entrega" editable={false} onPressIn={trocarExibicaoDataEntrega}/>
                            </Pressable>
                            {exibirDataEntrega &&
                                <DateTimePicker mode="date" value={formularioVenda.data_entrega} minimumDate={formularioVenda.data_entrega} display="calendar" onChange={onChangeDataEntrega} timeZoneName={"BR"}  />

                            }
                        </>
                    }

                    {Platform.OS==="ios" &&
                        <Pressable style={{position:"relative"}}>
                        <TextInput style={style.input} value={formularioVenda.data_entrega.toLocaleString("pt-BR").split(',')[0]} placeholder="Data do Aniversário" editable={false} onPressIn={trocarExibicaoDataEntrega}/>
                        <DateTimePicker mode="date" value={formularioVenda.data_entrega} style={style.inputCalendario} display="calendar" onChange={onChangeDataEntrega} timeZoneName={"BR"}  />
                        </Pressable>
                        
                    }

                    <Text>Tema da festa</Text>
                    <TextInput placeholderTextColor="gray"  style={campoTemaFesta ? style.input_selecionado : style.input} onFocus={()=>setCampoTemaFesta(true)} onBlur={()=> setCampoTemaFesta(false)} value={formularioVenda.tema_festa} onChangeText={(tema_festa)=>setFormularioVenda(estado=>({...estado,tema_festa}))} placeholder="Tema da festa" onSubmitEditing={()=> nomeAniversarianteRef.current?.focus()} returnKeyType="next"/>
                    <Text>Nome do aniversariante</Text>
                    <TextInput placeholderTextColor="gray" ref={nomeAniversarianteRef}  style={campoNomeAniversariante ? style.input_selecionado : style.input} onFocus={()=> setCampoNomeAniversariante(true)} onBlur={()=> setCampoNomeAniversariante(false)} value={formularioVenda.nome_aniversariante} onChangeText={(nome_aniversariante)=> setFormularioVenda(estado=> ({...estado,nome_aniversariante}))} placeholder="Nome do aniversariante" onSubmitEditing={()=> idadeCompletarRef.current?.focus()} returnKeyType="next"/>
                    <Text>Idade a completar</Text>
                    <TextInput placeholderTextColor="gray" ref={idadeCompletarRef} style={campoIdadeCompletar ? style.input_selecionado : style.input} onFocus={()=> setCampoIdadeCompletar(true)} onBlur={()=> setCampoIdadeCompletar(false)} keyboardType="number-pad" value={String(formularioVenda.idade_completar)} onChangeText={(idade_completar)=> setFormularioVenda(estado=>({...estado,idade_completar:idade_completar!==""?Number(parseInt(idade_completar)):0}))} placeholder="Idade a completar" />

                    {formularioVendaProduto.map((produto,index)=>{
                        return(
                            <View key={index} style={style.container_produtos}>
                                <Text>Produto {index+1}</Text>
                                <Dropdown data={listaProdutos} labelField="nome" value={{id:formularioVendaProduto[index].produto_id,nome:formularioVendaProduto[index].nome,preco:formularioVendaProduto[index].preco}} valueField="id" placeholder="Selecione um produto" search
                                style={[style.dropdown, campoDropdownProdutos[index] && { borderColor: '#f472b6',borderWidth:2 }]}
                                onChange={item => selecionarProduto(item,index)}
                                excludeItems={listaProdutosSelecionados}
                                onFocus={()=>onFocusCampoDropdownProdutos(index)}
                                onBlur={()=>onBlurCampoDropdownProdutos(index)}
                                />
                                <Text>Quantidade</Text>
                                {formularioVendaProduto.length-1===index ? 
                                <Dropdown   data={quantidadesSemZero}
                                    labelField="quantidade" onChange={valor => selecionarQuantidade(valor,index)} valueField="quantidade" value={String(formularioVendaProduto[index].quantidade)} placeholder="Selecione a quantidade" 
                                    style={[style.dropdown, campoDropdownQuantidade[index] && { borderColor: '#f472b6',borderWidth:2 }]} onFocus={()=>onFocusCampoDropdownQuantidade(index)} onBlur={()=>onBlurCampoDropdownQuantidade(index)}
                                    />
                                : 
                                <Dropdown  data={quantidadesComZero}  onChange={valor => selecionarQuantidade(valor,index)} labelField="quantidade" valueField="quantidade" value={String(formularioVendaProduto[index].quantidade)} style={[style.dropdown, campoDropdownQuantidade[index] && { borderColor: '#f472b6',borderWidth:2 }]} onFocus={()=>onFocusCampoDropdownQuantidade(index)} onBlur={()=>onBlurCampoDropdownQuantidade(index)} placeholder="Selecione a quantidade"/>
                                }
                                
                                
                            </View>
                        )
                    })}
                    
                    <Text>Valor pago na entrada</Text>
                    <TextInput style={campoValorEntrada ? style.input_selecionado : style.input} onFocus={()=> setCampoValorEntrada(true)} onBlur={()=> setCampoValorEntrada(false)} placeholderTextColor="gray" keyboardType="number-pad" value={precoEntrada} onChangeText={formatValue} placeholder="Valor pago na entrada"/>
                    <Text>Valor Total</Text>
                    <TextInput style={style.input} placeholderTextColor="gray" editable={false} value={String(formularioVenda.valor_total)}/>
                    <Text>Data do pagamento do restante</Text>
                    {Platform.OS==="android" &&
                    <>
                        <Pressable onPress={trocarExibicaoDataRestante}>
                        <TextInput placeholder="Pagamento restante" style={style.input} placeholderTextColor="gray" editable={false} value={formularioVenda.data_pagamento_restante.toLocaleString("pt-BR").split(',')[0]} onPressIn={trocarExibicaoDataRestante}/>
                        {exibirDataPagamentoRestante &&
                            <DateTimePicker value={formularioVenda.data_pagamento_restante} onChange={onChangeDataPagamentoRestante}  minimumDate={formularioVenda.data_pedido} maximumDate={formularioVenda.data_entrega} display="calendar"  />
                        }
                        </Pressable>
                    </>
                    }

                    {Platform.OS==="ios" &&
                        <Pressable style={{position:"relative"}}>
                        <TextInput style={style.input} value={formularioVenda.data_entrega.toLocaleString("pt-BR").split(',')[0]} placeholder="Pagamento restante" editable={false} onPressIn={trocarExibicaoDataRestante}/>
                        <DateTimePicker mode="date" value={formularioVenda.data_pagamento_restante} style={style.inputCalendario} minimumDate={formularioVenda.data_pedido} maximumDate={formularioVenda.data_entrega} display="calendar" onChange={onChangeDataPagamentoRestante} timeZoneName={"BR"}  />
                        </Pressable>
                        
                    }


                    <Dropdown data={[{tipo_pagamento:"Cartão"},{tipo_pagamento:"Dinheiro"},{tipo_pagamento:"Pix"}]} 
                    placeholder={!formularioVenda.metodo_pagamento ? 'Método de Pagamento' : '...'} labelField="tipo_pagamento" valueField="tipo_pagamento"
                    maxHeight={300}
                    onChange={item=> {
                        setFormularioVenda(estado=>({...estado,metodo_pagamento:item.tipo_pagamento}))
                    }}
                    value={formularioVenda.metodo_pagamento}
                    style={[style.dropdown, campoDropdownMetodoPagamento && { borderColor: '#f472b6',borderWidth:2 }]}
                    onFocus={()=>setCampoDropdownMetodoPagamento(true)}
                    onBlur={()=>setCampoDropdownMetodoPagamento(false)}
                    
                    /> 
                    <Text>Observações</Text>
                    <TextInput placeholderTextColor="gray" style={campoObservacoes ? style.input_selecionado : style.input} onFocus={()=> setCampoObservacoes(true)} onBlur={()=> setCampoObservacoes(false)} multiline numberOfLines={4} placeholder="Observações"  value={formularioVenda.observacoes} onChangeText={(observacoes)=> setFormularioVenda(estado=>({...estado,observacoes}))}/>

                    <TouchableOpacity style={style.botaoSalvar} onPress={salvar}>
                        <Text style={style.textoBotaoSalvar}>Salvar</Text>
                    </TouchableOpacity>  
                    
                    </View>
                    </TouchableWithoutFeedback>
                    </ScrollView >
                    </KeyboardAwareScrollView>
                </View>
            </View>
            
        
        </View>
    )
}


const style = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fdf2f8",
        padding:5,
        borderTopEndRadius:20,
        borderTopStartRadius:20,
        paddingBottom:10
        
        
    }, 
    form:{
        backgroundColor:"#fff",
        //paddingVertical:40,
        width:"100%",
        padding: 25,
        gap: 10,
        marginTop:10,
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
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
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
    inputCalendario:{
        position:"absolute",
        left:-5,
        top:5,
        opacity:0.1
    },
    container_produtos:{
        gap: 10,
        flexDirection: "column"
    },
    titulo:{
        color:"#fff",
        fontSize:16,
        fontWeight:"bold",
        marginBottom:10
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
    espacamentoForm:{
        gap:10,
        flexDirection:"column"
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
    
});