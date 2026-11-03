export default function Tratta(tid, sidStart, sidEnd, lid) {
    this.tid = tid;
    this.sidStart = sidStart;
    this.sidEnd = sidEnd;
    this.lid = lid;
    
    
    this.toJSON = () => {
        return {
            ...this,
        };
    };
}