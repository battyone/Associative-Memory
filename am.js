// Vector to vector associative memory using a Locality Sensitive Hash (LSH.)
// 
// Needs wht.js
class AM{
// vecLen must be 2,4,8,16,32.....
  constructor(vecLen,density,hash){
    this.vecLen=vecLen;
    this.density=density;
    this.hash=hash;
    this.weights=new Float32Array(vecLen*density);
    this.lsh=new Int8Array(vecLen*density); //store locality sensitive hash
    this.workA=new Float32Array(vecLen);
    this.workB=new Float32Array(vecLen);
  }
  
  train(target,input){
    this.recallLSH(this.workB,input);  //Recall and store LSH
    subtractVec(this.workB,target,this.workB);  // error vector
    scaleVec(this.workB,this.workB,1/this.density); //scale correctly before distributing over the weights
    var wtIdx=0;
    for(var i=0;i<this.density;i++){
      for(var j=0;j<this.vecLen;j++){
        this.weights[wtIdx]+=this.workB[j]*this.lsh[wtIdx]; // adjust weights to give zero error
        wtIdx++;
      }
    }  
  }
  
  recall(result,input){
    copyVec(this.workA,input);
    zeroVec(result);
    var h=this.hash;
    var wtIdx=0;
    for(var i=0;i<this.density;i++){
      rpVec(this.workA,h++);  // random projection
      for(var j=0;j<this.vecLen;j++){
        const sign=this.workA[j]<0? -1:1;  // LSH bit
        result[j]+=sign*this.weights[wtIdx++]; // weight each bit in the LSH and sum over density dimensions.
      }
    }
  }
// Recall and store LSH  
  recallLSH(result,input){
    copyVec(this.workA,input);
    zeroVec(result);
    var h=this.hash;
    var wtIdx=0;
    for(var i=0;i<this.density;i++){
      rpVec(this.workA,h++);  // random projection
      for(var j=0;j<this.vecLen;j++){
        const sign=this.workA[j]<0? -1:1;  // LSH bit
        this.lsh[wtIdx]=sign; // Store to avoid recomputing LSH during training
        result[j]+=sign*this.weights[wtIdx++]; // weight each bit in the LSH and sum over density dimensions.
      }
    }
  }
}