import { useSQLiteContext } from "expo-sqlite";

export interface FormularioVendaProps {
    id: number,
    id_cliente: number,
    data_pedido: Date,
    data_entrega: Date,
    tema_festa: string,
    nome_aniversariante: string,
    idade_completar: number,
    valor_entrada: number,
    valor_total: number,
    data_pagamento_restante: Date,
    metodo_pagamento: string,
    observacoes: string,
    status_entrega: boolean,
} 

export interface EditarFormularioVendaProps {
    id: number,
    id_cliente: number,
    nome_cliente: string,
    data_pedido: Date,
    data_entrega: Date,
    tema_festa: string,
    nome_aniversariante: string,
    idade_completar: number,
    valor_entrada: number,
    valor_total: number,
    data_pagamento_restante: Date,
    metodo_pagamento: string,
    observacoes: string,
    status_entrega: boolean,
} 

export interface VizualizarVendaProps {
    nome: string,
    data_pedido: string,
    data_entrega: string,
    tema_festa: string,
    nome_aniversariante: string,
    idade_completar: number,
    valor_entrada: number,
    valor_total: number,
    data_pagamento_restante: string,
    metodo_pagamento: string,
    observacoes: string,
    status_entrega: string,
}

export interface VizualizarProdutosVendaProps {
    nome_produto: string,
    quantidade: number
}

export interface FormularioVendasProdutosProps {
    venda_id: number,
    produto_id: number,
    quantidade: number,
    nome: string,
    preco: number
}

export interface ItemVendaProps {
    id: number,
    nome: string,
    data_entrega: string,
    valor_total: number,
    status_entrega: string
}

export interface ClienteVendasItemProps {
    id: number,
    nome: string,
    data_entrega: string,
    valor_total: number,
    tema_festa: string,
    nome_aniversariante: string,
    status_entrega: string
}

export function useVendasDatabase(){
    const database = useSQLiteContext();
    async function criarVenda(data:Omit<FormularioVendaProps,"id">) {
        
        const statement = await database.prepareAsync(`
            INSERT INTO vendas (id_cliente, data_pedido, data_entrega, tema_festa, nome_aniversariante, idade_completar, valor_entrada, valor_total, data_pagamento_restante ,metodo_pagamento, observacoes, status_entrega) 
            VALUES ($id_cliente, $data_pedido, $data_entrega, $tema_festa, $nome_aniversariante, $idade_completar, $valor_entrada, $valor_total, $data_pagamento_restante , $metodo_pagamento, $observacoes, $status_entrega)
        `);
        try {
            const formattedDataPedido = data.data_pedido instanceof Date ? data.data_pedido.toISOString().split('T')[0] : data.data_pedido;
            const formattedDataEntrega = data.data_entrega instanceof Date ? data.data_entrega.toISOString().split('T')[0] : data.data_entrega;
            const formattedDataPagamentoRestante = data.data_pagamento_restante instanceof Date ? data.data_pagamento_restante.toISOString().split('T')[0] : data.data_pagamento_restante;

            const result = await statement.executeAsync({
                $id_cliente: data.id_cliente,
                $data_pedido: formattedDataPedido,
                $data_entrega: formattedDataEntrega,
                $tema_festa: data.tema_festa,
                $nome_aniversariante: data.nome_aniversariante,
                $idade_completar: data.idade_completar,
                $valor_entrada: data.valor_entrada,
                $valor_total: data.valor_total,
                $data_pagamento_restante: formattedDataPagamentoRestante,
                $metodo_pagamento: data.metodo_pagamento,
                $observacoes: data.observacoes,
                $status_entrega: data.status_entrega ? 1 : 0  // Converta booleano para inteiro
            });
            const insertedRow = result.lastInsertRowId.toLocaleString();
            return {insertedRow};
        } catch (error) {
            throw error;
        }finally{
            statement.finalizeAsync();
        }
    }

    async function listarVendas(nome:string) {
        try {
           
            const query = `SELECT v.id , c.nome , v.data_entrega , v.valor_total, v.status_entrega FROM vendas v JOIN clientes c ON v.id_cliente = c.id WHERE c.nome LIKE ? ORDER BY v.id DESC`;
            const response = database.getAllAsync<ItemVendaProps>(query,`%${nome}%`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function listarVenda(id:number) {
        try {
            const query = 'SELECT c.nome , v.data_pedido , v.data_entrega , v.nome_aniversariante , v.tema_festa, v.idade_completar, v.valor_entrada, v.valor_total, v.data_pagamento_restante, v.observacoes, v.status_entrega FROM vendas v JOIN clientes c ON v.id_cliente = c.id WHERE v.id = ?';
            const response = database.getFirstAsync<VizualizarVendaProps>(query,[id]);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function listarQuantidadeVendasProdutos() {
        try {
            const query = `
                SELECT p.nome as nome, COUNT(vp.produto_id) as quantidade
                FROM produtos p
                LEFT JOIN vendas_produtos vp ON p.id = vp.produto_id
                GROUP BY p.id ORDER BY quantidade DESC;
            `;

            const response = database.getAllAsync<{nome:string,quantidade:number}>(query);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function listarQuantidadeVendasClientes() {
        try {
            const query = `
            SELECT c.nome as nome, COUNT(v.id) as quantidade FROM vendas v
            LEFT JOIN clientes c ON c.id = v.id_cliente
            GROUP BY v.id_cliente ORDER BY quantidade DESC
            `;

            const response = database.getAllAsync<{nome:string,quantidade:number}>(query);
            return response;
        } catch (error) {
            throw error;
        }
        
    }

    async function listarProdutoVenda(id:number) {
        try {
            const query = 'SELECT p.nome as nome_produto, vp.quantidade FROM vendas_produtos vp JOIN produtos p ON vp.produto_id=p.id WHERE vp.venda_id = ?';
            const response = database.getAllAsync<VizualizarProdutosVendaProps>(query,[id]);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function criarVendaProduto(data:Omit<FormularioVendasProdutosProps, 'nome' | 'preco'  >) {
        const statement = await database.prepareAsync('INSERT INTO vendas_produtos (venda_id, produto_id, quantidade) VALUES ($venda_id, $produto_id, $quantidade)');
        try {
            await statement.executeAsync({$venda_id: data.venda_id, $produto_id: data.produto_id, $quantidade: data.quantidade});
        } catch (error) {
            throw error;
        }finally{
            statement.finalizeAsync();
        }
    }

    async function listarVendasProdutos() {
        try {
            const query = "SELECT * FROM vendas_produtos"
            const response = database.getAllSync<FormularioVendasProdutosProps>(query);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function listarClienteRelacionado(id_cliente:number) {
        
        try {
            const query = 'SELECT v.id , c.nome , v.data_entrega , v.valor_total, v.status_entrega, v.nome_aniversariante, v.tema_festa  FROM vendas v JOIN clientes c ON v.id_cliente = c.id WHERE v.id_cliente = ?';
            const response = database.getAllAsync<ClienteVendasItemProps>(query,[id_cliente]);
            return response;
        } catch (error) {
            throw error;
        }

    }

    async function contarVendasProdutos(id_produto:number) {
        try {
            const query = 'SELECT COUNT(*) as totalVendas FROM vendas_produtos WHERE produto_id = ?';
            const response = database.getFirstAsync<{totalVendas:number}>(query,[id_produto]);
            return response;
        } catch (error){
            throw error;
        }
    }

    async function deletarVenda(id:number) {
        const statement =  await database.prepareAsync('DELETE FROM vendas WHERE id=$id');
        try {
            await statement.executeAsync({$id:id});
        } catch (error){
            throw error;
        }finally{
            statement.finalizeAsync();
        }
    }

    async function listarAgenda() {
        try {
            const query = 'SELECT v.id, c.nome, v.data_entrega, v.tema_festa, v.valor_total, v.nome_aniversariante FROM vendas v JOIN clientes c ON v.id_cliente=c.id WHERE v.status_entrega=0 ORDER BY v.id ASC';
            const result = await database.getAllAsync<ClienteVendasItemProps>(query);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async function alterarStatus(id:number,status_entrega:number) {
        const statement = await database.prepareAsync('UPDATE vendas SET status_entrega=$status_entrega WHERE id=$id');
        try {
            const result = await statement.executeAsync({$id:id,$status_entrega:status_entrega});

        } catch (error) {
            throw error;
        }
    }

    async function formularioVenda(id:number) {
        try {
            const query = 'SELECT v.id, c.id as id_cliente ,c.nome as nome_cliente, v.data_pedido, v.data_entrega, v.tema_festa, v.nome_aniversariante, v.idade_completar, v.valor_entrada, v.valor_total, v.data_pagamento_restante, v.metodo_pagamento, v.observacoes FROM vendas v JOIN clientes c ON v.id_cliente=c.id WHERE v.id=?';
            const result = await database.getFirstAsync<EditarFormularioVendaProps>(query,[id]);
            return result;
        } catch (error) {
            throw error;
        }
        
    }


    async function editarVenda(data:EditarFormularioVendaProps) {
        const statement = await database.prepareAsync(`UPDATE vendas SET id_cliente=$id_cliente , data_pedido=$data_pedido, data_entrega=$data_entrega, tema_festa=$tema_festa, nome_aniversariante=$nome_aniversariante, idade_completar=$idade_completar, valor_entrada=$valor_entrada, valor_total=$valor_total, data_pagamento_restante=$data_pagamento_restante ,metodo_pagamento=$metodo_pagamento, observacoes=$observacoes WHERE id=$id`);
        try {
            const formattedDataPedido = data.data_pedido instanceof Date ? data.data_pedido.toISOString().split('T')[0] : data.data_pedido;
            const formattedDataEntrega = data.data_entrega instanceof Date ? data.data_entrega.toISOString().split('T')[0] : data.data_entrega;
            const formattedDataPagamentoRestante = data.data_pagamento_restante instanceof Date ? data.data_pagamento_restante.toISOString().split('T')[0] : data.data_pagamento_restante;
            const result = await statement.executeAsync({$id:data.id,$id_cliente:data.id_cliente,$data_pedido:formattedDataPedido,$data_entrega:formattedDataEntrega,$tema_festa:data.tema_festa,$nome_aniversariante:data.nome_aniversariante,$idade_completar:data.idade_completar,$valor_entrada:data.valor_entrada,$valor_total:data.valor_total,$data_pagamento_restante:formattedDataPagamentoRestante,$metodo_pagamento:data.metodo_pagamento,$observacoes:data.observacoes});
        } catch (error) {
            throw error;
        }finally{
            statement.finalizeAsync();
        }
    }

    async function formularioVendaProdutos(id:number) {
        try {
            const query = "SELECT vp.produto_id, vp.venda_id, p.nome, vp.quantidade, p.preco FROM vendas_produtos vp JOIN produtos p ON vp.produto_id=p.id WHERE vp.venda_id=?";
            const result = await database.getAllAsync<FormularioVendasProdutosProps>(query,id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async function atualizarValorTotal(id:number,valor_total:number) {
        const statement = await database.prepareAsync('UPDATE vendas SET valor_total=$valor_total WHERE id=$id');
        try {
            const result = await statement.executeAsync({$id:id,$valor_total:valor_total});
        } catch (error) {
            throw error;
        }
    }

    async function atualizarQuantidade(id:number,quantidade:number) {
        const statement = await database.prepareAsync('UPDATE vendas_produtos SET quantidade=$quantidade WHERE produto_id=$id');
        try {
            const result = await statement.executeAsync({$id:id,$quantidade:quantidade});
        } catch (error) {
            throw error;
        }finally{
            statement.finalizeAsync();
        }
    }

    async function deletarProduto(id:number) {
        const statement = await database.prepareAsync('DELETE FROM vendas_produtos WHERE produto_id=$id');
        try {
            const result = await statement.executeAsync({$id:id});
        } catch (error) {
            throw error;
        }finally{
            statement.finalizeAsync();
        }
    }

    async function consultarValoresVendas(data: string) {
        try {
            const query = "SELECT strftime('%m', data_pedido) AS mes, COUNT(strftime('%m', data_pedido)) as quantidade ,SUM(valor_total) AS valor_total FROM vendas WHERE strftime('%Y', data_pedido) = ? GROUP BY mes ORDER BY mes;"
            const result = await database.getAllAsync<{mes:string,quantidade:number,valor_total:number}>(query,[data]);
            return result
        } catch (error) {
            throw error;
        }
    }
    



    return {criarVenda,listarVendas,criarVendaProduto,listarVendasProdutos,listarClienteRelacionado,contarVendasProdutos,deletarVenda,listarVenda,listarProdutoVenda,listarQuantidadeVendasProdutos,listarQuantidadeVendasClientes,listarAgenda,alterarStatus,formularioVenda,editarVenda,formularioVendaProdutos,atualizarValorTotal,atualizarQuantidade,deletarProduto,consultarValoresVendas};
}

