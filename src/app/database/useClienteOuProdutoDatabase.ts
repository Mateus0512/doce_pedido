import { useSQLiteContext } from "expo-sqlite";

export interface ClienteOuProdutosDatabaseProps  {
    id: number
    nome: string
    telefone?: string
    preco?: number
}

export type ProdutoDatabaseProps = {
    id: number,
    nome: string,
    preco: number
}



export function useClienteOuProdutoDatabase(){
    const database = useSQLiteContext();

    async function criarCliente(data: Omit<ClienteOuProdutosDatabaseProps,'id'>){
        const statement = await database.prepareAsync("INSERT INTO clientes (nome,telefone) VALUES ($nome,$telefone)");
        const telefone = data.telefone ?? '';
        try {
            const result = await statement.executeAsync({$nome: data.nome, $telefone: telefone});
            const insertedRow = result.lastInsertRowId.toLocaleString();
            return {insertedRow}
        } catch (error) {
            throw error;
        }finally{
            statement.finalizeAsync();
        }
    }

    async function procurarClientePeloNome(nome:string) {
        try {
            const query = "SELECT * FROM clientes WHERE nome LIKE ? ORDER BY nome ASC";
            const response = await database.getAllAsync<ClienteOuProdutosDatabaseProps>(query,`%${nome}%`);
            return response;
        } catch (error) {
            throw error
        }
    }

    async function deletarCliente(id:number) {
        const statement = await database.prepareAsync('DELETE FROM clientes WHERE id=$id');
        try {
            await statement.executeAsync({$id:id});
        } catch (error) {
            throw error;
        }
    }

    async function editarCliente(data: ClienteOuProdutosDatabaseProps) {
        const statement = await database.prepareAsync("UPDATE clientes set nome=$nome, telefone=$telefone WHERE id=$id");
        const telefone = data.telefone ?? '';
        try {
            await statement.executeAsync({$id: data.id, $nome: data.nome, $telefone: telefone});
        } catch (error) {
            throw error;
        }finally{
            await statement.finalizeAsync();
        }
    }

    

    async function criarProduto(data: Omit<ClienteOuProdutosDatabaseProps,'id'>) {
        const statement = await database.prepareAsync("INSERT INTO produtos (nome,preco) VALUES ($nome,$preco)");
        const preco = data.preco ?? '';
        try {
            const result = await statement.executeAsync({$nome: data.nome, $preco: preco});
            const insertedRow  = result.lastInsertRowId.toLocaleString();
            return { insertedRow };
        } catch (error) {
            throw error;
        }finally{
            statement.finalizeAsync();
        }
    }

    async function procurarProdutoPeloNome(nome:string) {
        try {
            const query = "SELECT * FROM produtos WHERE nome LIKE ? ORDER BY nome ASC";
            const response = await database.getAllAsync<ClienteOuProdutosDatabaseProps>(query,`%${nome}%`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function deletarProduto(id:number) {
        const statement = await database.prepareAsync('DELETE FROM produtos WHERE id=$id');
        try {
            await statement.executeAsync({$id:id});

        } catch (error) {
            throw error;
        }
    }

    async function editarProduto(data: ClienteOuProdutosDatabaseProps) {
        const statement = await database.prepareAsync("UPDATE produtos set nome=$nome, preco=$preco WHERE id=$id");
        const preco = data.preco ?? 0;
        try {
            await statement.executeAsync({$id: data.id, $nome: data.nome, $preco: preco});
        } catch (error) {
            throw error;
        }finally{
            await statement.finalizeAsync();
        }
    }

    async function selecionarItem(id:number,tabela:string) {
        try {
            const query = `SELECT * FROM ${tabela} WHERE id=${id}`
            const item = database.getFirstAsync<ClienteOuProdutosDatabaseProps>(query);
            return item;
            
        } catch (error) {
            throw error;
        }
        
    }

    async function criarVariosRegistros(query:string) {
        try {
            await database.execAsync(query);
        } catch (error) {
            await database.execAsync('ROLLBACK;')
            throw error;
            
        }
    }

    async function verificarNome(nome:string,tabela:string) {
        try {
            const query = `SELECT nome FROM ${tabela} WHERE lower(nome)='${nome}'`;
            const response = await database.getFirstAsync<{nome:string}>(query);
            return response;
        } catch (error) {
            throw error;
        }
    }

    

    return {criarCliente,procurarClientePeloNome,procurarProdutoPeloNome,criarProduto,deletarCliente,deletarProduto,editarCliente,editarProduto,selecionarItem,criarVariosRegistros,verificarNome};
}