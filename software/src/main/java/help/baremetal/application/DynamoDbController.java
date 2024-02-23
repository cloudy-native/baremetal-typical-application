package help.baremetal.application;

import static java.util.stream.Collectors.toMap;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.function.Function;

import io.micronaut.context.annotation.Value;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Produces;
import jakarta.inject.Inject;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;

@Controller("/dynamodb")
class DynamoDbController {
    private static final Random R = new Random();

    @Inject
    private DynamoDbClient dynamoDbClient;

    @Value(value = "${DYNAMODB_TABLE_NAME}")
    private String dynamoDbTableName;

    @Get
    @Produces(MediaType.APPLICATION_JSON)
    List<Map<String, String>> indexGet() {
        ScanRequest scanRequest = ScanRequest.builder()
                .tableName(dynamoDbTableName)
                .limit(10)
                .build();
        final var scanResponse = dynamoDbClient.scan(scanRequest);

        final Function<Map<String, AttributeValue>, Map<String, String>> mapper = (attributes) -> attributes.entrySet()
                .stream().collect(toMap(Map.Entry::getKey, (v) -> v.getValue().toString()));

        return scanResponse.items().stream().map(mapper).toList();
    }

    @Post
    @Produces(MediaType.APPLICATION_JSON)
    List<String> indexPost() {
        final var item = new HashMap<String, AttributeValue>() {
            {
                put("id", attributeValue(uuid()));
                put("uuid", attributeValue(uuid()));
                put("foo", attributeValue(R.nextInt()));
                put("bar", attributeValue(R.nextDouble()));
                put("baz", attributeValue(R.nextBoolean()));
            }
        };

        final var putItemRequest = PutItemRequest.builder()
                .tableName(dynamoDbTableName)
                .item(item)
                .build();
        final var putItemResponse = dynamoDbClient.putItem(putItemRequest);

        return List.of("OK");
    }

    private static String uuid() {
        return UUID.randomUUID().toString();
    }

    private static AttributeValue attributeValue(final String value) {
        return AttributeValue.builder().s(value).build();
    }

    private static AttributeValue attributeValue(final int value) {
        return AttributeValue.builder().n("" + value).build();
    }

    private static AttributeValue attributeValue(final double value) {
        return AttributeValue.builder().n("" + value).build();
    }

    private static AttributeValue attributeValue(final boolean value) {
        return AttributeValue.builder().bool(value).build();
    }
}
