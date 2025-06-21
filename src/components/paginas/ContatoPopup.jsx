import "./Contato.css";

export default function ContatoPopup({ ongInfo, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Informações da ONG</h2>
        <p><strong>Nome:</strong> {ongInfo.nomeOng}</p>
        <p><strong>Email:</strong> {ongInfo.email}</p>
        <p><strong>CNPJ:</strong> {ongInfo.cnpj}</p>
        <button onClick={onClose} className="btn btn-secondary mt-3">Fechar</button>
      </div>
    </div>
  );
}
