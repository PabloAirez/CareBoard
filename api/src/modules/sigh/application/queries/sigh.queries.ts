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
      (CAST(ee.cod_fia AS VARCHAR) || '_' || CAST(ee.data_observacao AS VARCHAR) || '_' || COALESCE(CAST(ee.hora_observacao AS VARCHAR), '00:00')) AS id_observacao,
      ee.cod_fia,
      fia.cod_paciente AS id_paciente,
      p.nm_paciente,
      ee.data_observacao,
      ee.hora_observacao,
      ee.fr,
      ee.fc,
      ee.pressao,
      ee.temperatura,
      la.sensorio
    FROM sigh.evolucao_enfermagem ee
    JOIN sigh.ficha_amb_int fia ON fia.id_fia = ee.cod_fia
    LEFT JOIN sigh.pacientes p ON p.id_paciente = fia.cod_paciente
    LEFT JOIN sigh.laudos_aihs la ON la.cod_fia = fia.id_fia
    WHERE fia.tipo_atend = 'INT'
      AND fia.data_alta IS NULL
    ORDER BY ee.cod_fia ASC, ee.data_observacao ASC, ee.hora_observacao ASC;
  `,

  GET_APRAZAMENTOS_MEDICAMENTOS: `
    SELECT DISTINCT
      ire.id_item_requisicao_estoque AS id_item,
      re.cod_fia,
      p.nm_produto AS nome_medicamento,
      ire.horarios_aprazamento,
      ire.observacao,
      ire.data AS data_aprazamento,
      fia.cod_leito AS id_leito,
      (COALESCE(q.nm_quarto, 'Q') || '-' || COALESCE(l.nm_leito, 'L')) AS numero_leito,
      u.id_unidade
    FROM sigh.itens_requisicoes_estoques ire
    JOIN sigh.requisicoes_estoques re ON ire.cod_requisicao_estoque = re.id_requisicao_estoque
    JOIN sigh.ficha_amb_int fia ON fia.id_fia = re.cod_fia
    LEFT JOIN sigh.produtos p ON p.id_produto = ire.cod_produto
    LEFT JOIN sigh.leitos l ON fia.cod_leito = l.id_leito
    LEFT JOIN sigh.quartos_enfermarias q ON l.cod_quarto_enf = q.id_quarto_enf
    LEFT JOIN sigh.unidades u ON u.id_unidade = fia.cod_unidade
    WHERE fia.tipo_atend = 'INT'
      AND fia.data_alta IS NULL
      AND ire.tipo_item_prescricao = 'ME'
      AND (ire.data = CURRENT_DATE OR ire.data IS NULL);
  `,
};
