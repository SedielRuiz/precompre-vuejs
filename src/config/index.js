const dev_enviroment = {
    //ROOT_API: 'http://192.168.1.195:52000/api/'
    ROOT_API: 'http://35.185.114.245/api/'
    //ROOT_API: 'http://localhost:52000/api/'
  };
  const production_enviroment = {
    ROOT_API: 'api/admin'
  };
  
  let enviroment;
  
  if(process.env.NODE_ENV === 'production'){
      enviroment = production_enviroment;	
  }else{
    enviroment = dev_enviroment;	
  }
  
  export default enviroment;