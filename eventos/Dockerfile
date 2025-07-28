# Imagen base con Java 17
FROM eclipse-temurin:17-jdk-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el wrapper de Maven y el resto del proyecto
COPY . .

# Dar permisos de ejecución al wrapper
RUN chmod +x mvnw

# Construir el proyecto (instala dependencias y compila)
RUN ./mvnw clean install -DskipTests

# Exponer el puerto (ajústalo si tu app usa otro)
EXPOSE 8080

# Comando por defecto para ejecutar el .jar
CMD ["java", "-jar", "target/eventos-0.0.1-SNAPSHOT.jar"]