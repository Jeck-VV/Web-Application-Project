export default function Stazione(sid, nomeStazione, xCoordCircle, yCoordCircle, xCoordName, yCoordName, Interscambio) {
    this.sid = sid;
    this.nomeStazione = nomeStazione;
    this.xCoordCircle = xCoordCircle;
    this.yCoordCircle = yCoordCircle;
    this.xCoordName = xCoordName;
    this.yCoordName = yCoordName;
    this.Interscambio = Interscambio;
    
    
    this.toJSON = () => {
        return {
            ...this,
        };
    };
}