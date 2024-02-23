package help.baremetal.application;

import java.util.List;

import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Produces;
import jakarta.inject.Inject;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Bucket;

@Controller("/s3")
class S3Controller {
    @Inject
    public S3Client s3Client;

    @Get
    @Produces(MediaType.APPLICATION_JSON)
    List<String> index() {
        final var buckets = s3Client.listBuckets();

        return buckets.buckets().stream().map(Bucket::name).toList();
    }
}
