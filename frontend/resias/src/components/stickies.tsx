import { useState} from "react";  

  const Stickies = () => {
    const isLoading =  useState(false);
    const error = useState(false);
    let data: any = [];

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>{data?.map((sticky) => <div key={sticky.id}>{sticky.text}</div>)}</div>;
  };

  export default Stickies;