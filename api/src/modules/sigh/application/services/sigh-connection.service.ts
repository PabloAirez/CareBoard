import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';

export interface DatabaseCredentials {
  host: string;
  porta: number;
  nomeBanco: string;
  usuario: string;
  senha: string;
}

@Injectable()
export class SighConnectionService {
  private readonly logger = new Logger(SighConnectionService.name);

  async testConnection(credentials: DatabaseCredentials): Promise<boolean> {
    const client = new Client({
      host: credentials.host,
      port: credentials.porta,
      database: credentials.nomeBanco,
      user: credentials.usuario,
      password: credentials.senha,
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      return true;
    } catch (error) {
      this.logger.error(`Erro ao testar conexao com banco externo SIGH: ${(error as Error).message}`);
      return false;
    }
  }

  async executeQuery<T = any>(credentials: DatabaseCredentials, sql: string, params: any[] = []): Promise<T[]> {
    const client = new Client({
      host: credentials.host,
      port: credentials.porta,
      database: credentials.nomeBanco,
      user: credentials.usuario,
      password: credentials.senha,
      connectionTimeoutMillis: 10000,
    });

    try {
      await client.connect();
      const res = await client.query(sql, params);
      await client.end();
      return res.rows;
    } catch (error) {
      this.logger.error(`Erro ao executar query no SIGH: ${(error as Error).message}`);
      try { await client.end(); } catch {}
      throw error;
    }
  }
}
