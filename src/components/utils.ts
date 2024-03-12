class AppUtilities {
    static generateUniqueId = () => {
        return "_" + Math.random().toString(36).substring(2, 9);
      };
}
export default AppUtilities;