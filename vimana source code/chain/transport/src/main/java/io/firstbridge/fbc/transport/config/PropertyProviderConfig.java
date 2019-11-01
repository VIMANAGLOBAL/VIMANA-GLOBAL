package io.vimana.vim.transport.config;

import io.vimana.vim.transport.NotFoundException;
import io.vimana.vim.transport.annotation.Property;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.inject.Singleton;
import java.io.*;
import java.util.Optional;
import java.util.Properties;

@Singleton
public class PropertyProviderConfig {

    public static final String PROPERTIES_FILENAME = "/peer.properties";
    public static final String USER_HOME = System.getProperty("user.home");
    final static Logger logger = LoggerFactory.getLogger(PropertyProviderConfig.class);

    private Properties properties;

    @Property
    @Produces
    public String produceString(final InjectionPoint ip) {
        return this.properties.getProperty(getKey(ip), "").trim();
    }

    @Property
    @Produces
    public int produceInt(final InjectionPoint ip) {
        return Integer.valueOf(this.properties.getProperty(getKey(ip), ""));
    }

    @Property
    @Produces
    public long produceLong(final InjectionPoint ip) {
        return Long.valueOf(this.properties.getProperty(getKey(ip), ""));
    }

    @Property
    @Produces
    public boolean produceBoolean(final InjectionPoint ip) {
        return Boolean.valueOf(this.properties.getProperty(getKey(ip), ""));
    }

    private String getKey(final InjectionPoint ip) {
        return (ip.getAnnotated().isAnnotationPresent(Property.class) &&
                !ip.getAnnotated().getAnnotation(Property.class).value().isEmpty())
                ? ip.getAnnotated().getAnnotation(Property.class).value()
                : ip.getMember().getName();
    }

    @PostConstruct
    public void initProperties() {
        logger.debug("Initializing properties...");
        this.properties = getDefaultProperties(PROPERTIES_FILENAME);

        //get local storage location
        String localPath = Optional.ofNullable(properties
                .getProperty("peer.config.dir"))
                .orElseThrow(() ->
                        new NotFoundException("Property not found!"));
        //load properties from local storage
        File localConfigFile = new File(USER_HOME + localPath);
        try {
            this.properties = getConfigurationProperties(localConfigFile);
            logger.debug("Found local properties. Using them instead of default..");
        } catch (FileNotFoundException e) {
            createAndWritePropertiesToFile(properties, localConfigFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void createAndWritePropertiesToFile(Properties properties, File file) {
        try {
            logger.debug(file.getAbsolutePath());
            file.getParentFile().mkdirs();
            file.createNewFile();
            OutputStream output = new FileOutputStream(file);
            properties.store(output, null);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Properties getConfigurationProperties(File file) throws IOException {
        Properties properties = new Properties();
        InputStream stream = new FileInputStream(file);
        properties.load(stream);
        return properties;
    }

    //loading properties form
    private Properties getDefaultProperties(String name) {
        logger.debug("Loading default properties...");
        Properties properties = new Properties();
        final InputStream stream = PropertyProviderConfig.class
                .getResourceAsStream(name);
        try {
            properties.load(stream);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return properties;
    }
}
