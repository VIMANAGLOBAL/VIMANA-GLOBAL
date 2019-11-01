package io.vimana.vim.util;

/**
 * Standard version checks.
 * Version format is X.Y.Z
 * X - Major version, incomaptible absolutely
 * Y - Minor version, may be compatible but rather is not
 * Z - Revisoon/bugfix. Must be compatible
 * 
 * @author alukin@gmail.com
 */

public class VersionChecker {
    
    private static final long my = parse(Constants.VERSION);
    private static final long minCompat = parse(Constants.MIN_VERSION);
    private static final long maxCompat = parse(Constants.MAX_VERSION);
    

    
    public static long parse(String ver){
      int[] vvv = new int[3];
      String[] vv = ver.split("\\.");
      for(int i=0; i<vvv.length; i++){
          try{
              vvv[i]=Integer.parseInt(vv[i]);
          }catch(Exception e){
              vvv[i]=0;
          }
      }
      return 1L*vvv[0]*1000*1000+vvv[1]*1000*vvv[2];
    }
    
    public static boolean isCompatible(String version){
        long yours = parse(version);
        return yours >=minCompat && yours <=maxCompat;
    }
    
    public static boolean isTooOld(String version){
        long yours = parse(version);
        return yours < minCompat;
    }
    
    public static boolean isTooNew(String version){
        long yours = parse(version);
        return yours >maxCompat;
    }
    
}
