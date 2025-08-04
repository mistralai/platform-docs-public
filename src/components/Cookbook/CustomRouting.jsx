const CustomRouting = ({ item }) => {
    const path = item.path;
    const routingPath = `/cookbooks/${path}`;
    return routingPath;
};
  
export default CustomRouting;