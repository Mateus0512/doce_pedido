import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    try {
        await database.execAsync('PRAGMA journal_mode = WAL');
        await database.execAsync('PRAGMA foreign_keys = ON');
        await database.execAsync(`PRAGMA encoding = 'UTF-8';`);
        await database.execAsync(`
            BEGIN TRANSACTION;

            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                telefone TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                preco REAL NOT NULL
            );

            CREATE TABLE IF NOT EXISTS vendas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_cliente INTEGER,
                data_pedido TEXT,            
                data_entrega TEXT,           
                tema_festa TEXT,
                nome_aniversariante TEXT,
                idade_completar INTEGER,
                valor_entrada REAL,
                valor_total REAL,
                data_pagamento_restante TEXT,
                metodo_pagamento TEXT,       
                observacoes TEXT,
                status_entrega INTEGER,      
                FOREIGN KEY (id_cliente) REFERENCES clientes(id)
            );

            CREATE TABLE IF NOT EXISTS vendas_produtos (
                venda_id INTEGER,
                produto_id INTEGER,
                quantidade INTEGER NOT NULL,
                FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
                FOREIGN KEY (produto_id) REFERENCES produtos(id),
                PRIMARY KEY (venda_id, produto_id)
            );

            COMMIT;
        `);
    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
        await database.execAsync("ROLLBACK;"); // Reverter em caso de erro
    }

    // try {
    //     await database.execAsync(`
    //             BEGIN TRANSACTION;
    //             DROP TABLE IF EXISTS clientes;
    //             DROP TABLE IF EXISTS produtos;
    //             DROP TABLE IF EXISTS vendas;
    //             DROP TABLE IF EXISTS vendas_produtos;
    //             COMMIT;
    //         `);
    // } catch (error) {
    //     console.error("Erro ao inicializar o banco de dados:", error);
    //     await database.execAsync("ROLLBACK;"); // Reverter em caso de erro
    // }

}