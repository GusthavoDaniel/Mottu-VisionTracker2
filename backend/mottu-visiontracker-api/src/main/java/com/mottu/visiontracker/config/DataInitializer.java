package com.mottu.visiontracker.config;

import com.mottu.visiontracker.entity.Alerta;
import com.mottu.visiontracker.entity.Moto;
import com.mottu.visiontracker.repository.AlertaRepository;
import com.mottu.visiontracker.repository.MotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private MotoRepository motoRepository;

    @Autowired
    private AlertaRepository alertaRepository;

    @Override
    public void run(String... args) throws Exception {
        // Verificar se já existem dados no banco
        if (motoRepository.count() > 0) {
            System.out.println("Dados já existem no banco. Pulando inicialização.");
            return;
        }

        System.out.println("Inicializando dados no banco H2...");

        // Criar motos de exemplo
        List<Moto> motosExemplo = Arrays.asList(
            createMoto("ABC1234", "CG 160", "Verde Mottu", "João Silva", "SN001", "RF001", Moto.StatusMoto.ATIVA, "A1", "1"),
            createMoto("DEF5678", "Factor 125", "Preta", "Maria Santos", "SN002", "RF002", Moto.StatusMoto.ATIVA, "A1", "2"),
            createMoto("GHI9012", "Biz 125", "Branca", "Pedro Oliveira", "SN003", "RF003", Moto.StatusMoto.MANUTENCAO, "B2", "3"),
            createMoto("JKL3456", "PCX 150", "Vermelha", "Ana Costa", "SN004", "RF004", Moto.StatusMoto.ATIVA, "A1", "4"),
            createMoto("MNO7890", "CB 600F", "Azul", "Carlos Ferreira", "SN005", "RF005", Moto.StatusMoto.INATIVA, "C3", "5"),
            createMoto("PQR1357", "CG 160", "Verde Mottu", "Lucia Mendes", "SN006", "RF006", Moto.StatusMoto.ATIVA, "A1", "6"),
            createMoto("STU2468", "Factor 125", "Preta", "Roberto Lima", "SN007", "RF007", Moto.StatusMoto.ATIVA, "B2", "1"),
            createMoto("VWX9753", "Biz 125", "Branca", "Fernanda Rocha", "SN008", "RF008", Moto.StatusMoto.MANUTENCAO, "A1", "7")
        );

        List<Moto> motosSalvas = motoRepository.saveAll(motosExemplo);
        System.out.println("Criadas " + motosSalvas.size() + " motos de exemplo.");

        // Criar alertas de exemplo
        List<Alerta> alertasExemplo = Arrays.asList(
            createAlerta(motosSalvas.get(0), Alerta.TipoAlerta.MOVIMENTO_NAO_AUTORIZADO, 
                        "Movimento detectado fora do horário permitido na moto ABC1234", false),
            createAlerta(motosSalvas.get(1), Alerta.TipoAlerta.BATERIA_BAIXA, 
                        "Nível de bateria baixo detectado na moto DEF5678", false),
            createAlerta(motosSalvas.get(2), Alerta.TipoAlerta.MANUTENCAO_NECESSARIA, 
                        "Manutenção preventiva necessária na moto GHI9012", true),
            createAlerta(motosSalvas.get(3), Alerta.TipoAlerta.FORA_DA_AREA, 
                        "Moto PCX 150 detectada fora da área permitida", false),
            createAlerta(motosSalvas.get(4), Alerta.TipoAlerta.SEM_LEITURA, 
                        "Falha na leitura RFID da moto MNO7890", true),
            createAlerta(motosSalvas.get(0), Alerta.TipoAlerta.BATERIA_BAIXA, 
                        "Segundo alerta de bateria baixa na moto ABC1234", false),
            createAlerta(motosSalvas.get(5), Alerta.TipoAlerta.MOVIMENTO_NAO_AUTORIZADO, 
                        "Tentativa de acesso não autorizado à moto PQR1357", false),
            createAlerta(motosSalvas.get(6), Alerta.TipoAlerta.MANUTENCAO_NECESSARIA, 
                        "Revisão de 10.000 km necessária na moto STU2468", false)
        );

        List<Alerta> alertasSalvos = alertaRepository.saveAll(alertasExemplo);
        System.out.println("Criados " + alertasSalvos.size() + " alertas de exemplo.");

        System.out.println("Inicialização de dados concluída com sucesso!");
    }

    private Moto createMoto(String placa, String modelo, String cor, String proprietario, 
                           String numeroSerie, String tagRFID, Moto.StatusMoto status, 
                           String setor, String posicao) {
        Moto moto = new Moto();
        moto.setPlaca(placa);
        moto.setModelo(modelo);
        moto.setCor(cor);
        moto.setProprietario(proprietario);
        moto.setNumeroSerie(numeroSerie);
        moto.setTagRFID(tagRFID);
        moto.setStatus(status);
        moto.setSetor(setor);
        moto.setPosicao(posicao);
        return moto;
    }

    private Alerta createAlerta(Moto moto, Alerta.TipoAlerta tipo, String descricao, boolean resolvido) {
        Alerta alerta = new Alerta();
        alerta.setMoto(moto);
        alerta.setTipo(tipo);
        alerta.setDescricao(descricao);
        alerta.setResolvido(resolvido);
        
        if (resolvido) {
            alerta.setResolvedAt(LocalDateTime.now().minusHours(1));
        }
        
        return alerta;
    }
}
