export const SIGH_QUERIES = {
  GET_UNIDADES: `
    SELECT 
      id_unidade,
      nm_unidade
    FROM sigh.unidades;
  `,

  GET_LEITOS: `
    SELECT DISTINCT
      l.id_leito,
      (COALESCE(q.nm_quarto, 'Q') || '-' || COALESCE(l.nm_leito, 'L')) AS numero_leito,
      sl.nm_sit_leito AS status_leito,
      fa.cod_unidade AS id_unidade,
      u.nm_unidade
    FROM sigh.leitos l
    LEFT JOIN sigh.quartos_enfermarias q ON l.cod_quarto_enf = q.id_quarto_enf
    LEFT JOIN sigh.ficha_amb_int fa ON fa.cod_leito = l.id_leito
    LEFT JOIN sigh.unidades u ON u.id_unidade = fa.cod_unidade
    LEFT JOIN sigh.situacoes_leitos sl ON l.cod_sit_leito = sl.id_sit_leito;
  `,

  GET_PACIENTES_INTERNACOES: `
    SELECT 
      fa.id_fia,
      p.id_paciente,
      p.nm_paciente,
      sx.nm_sexo,
      fa.cod_motivo_isolamento,
      fa.data_atendimento,
      fa.data_alta,
      'ativa' AS descr_situacao_atendimento,
      u.id_unidade,
      u.nm_unidade,
      fa.cod_leito AS id_leito,
      (COALESCE(q.nm_quarto, 'Q') || '-' || COALESCE(l.nm_leito, 'L')) AS numero_leito
    FROM sigh.ficha_amb_int fa
    JOIN sigh.pacientes p ON p.id_paciente = fa.cod_paciente
    LEFT JOIN sigh.sexos sx ON p.cod_sexo = sx.id_sexo
    LEFT JOIN sigh.leitos l ON fa.cod_leito = l.id_leito
    LEFT JOIN sigh.quartos_enfermarias q ON l.cod_quarto_enf = q.id_quarto_enf
    LEFT JOIN sigh.unidades u ON u.id_unidade = fa.cod_unidade
    WHERE fa.tipo_atend = 'INT'
      AND fa.data_alta IS NULL;
  `,

  GET_SINAIS_VITAIS: `
    SELECT 
      sv.id_observacao,
      p.id_paciente,
      p.nm_paciente,
      sv.data_observacao,
      sv.hora_observacao,
      sv.temperatura,
      sv.fc,
      sv.fr,
      sv.pas,
      sv.pad,
      er.sensorio
    FROM sigh.sinais_vitais sv
    JOIN sigh.pacientes p ON (sv.cod_paciente = p.id_paciente OR sv.cod_paciente = p.cod_paciente)
    LEFT JOIN sigh.evolucao_regulacao er ON ((sv.cod_paciente = er.id_paciente OR sv.cod_paciente = er.cod_paciente)
      AND sv.data_observacao = er.data_observacao)
    ORDER BY sv.data_observacao DESC;
  `,
};
