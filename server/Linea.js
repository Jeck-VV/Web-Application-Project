export default function Linea(lid, nomeLinea) {
    this.lid = lid;
    this.nomeLinea = nomeLinea;
    
    this.toJSON = () => {
        return {
            ...this,
        };
    };
}