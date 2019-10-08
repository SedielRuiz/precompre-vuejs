const dev_enviroment = {
    ROOT_API: 'https://sandbox.nectarfresco.com/api/admin/'
    //ROOT_API: 'http://35.185.114.245/api/admin/'
    //ROOT_API: 'http://localhost:52000/api/admin/' 
  };
  const production_enviroment = {
    //ROOT_API: 'http://35.185.114.245/api/admin/'
    ROOT_API: 'api/admin/'
  };
  
  let enviroment;
  
  if(process.env.NODE_ENV === 'production'){
      enviroment = production_enviroment;	
  }else{
    enviroment = dev_enviroment;	
  }
  
  export default enviroment;