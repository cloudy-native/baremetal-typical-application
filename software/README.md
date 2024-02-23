- [What's all this then?](#whats-all-this-then)
- [What does the application do?](#what-does-the-application-do)
- [What is the platform and language?](#what-is-the-platform-and-language)
- [How do I make it go?](#how-do-i-make-it-go)
- [How do I access it?](#how-do-i-access-it)
- [What if it doesn't go?](#what-if-it-doesnt-go)

# What's all this then?

It's a sample application to deploy to the AWS ECS cluster you deployed with [baremetal.help](https://baremetal.help).

# What does the application do?

// TODO: 

Almost nothing. It has two endpoints

| endpoint | returns | provided by |
| --- | --- | --- | 
| `/hello` | `["hello","there]` | The application |
| `/health` | `{"status":"UP}` | The application management runtime |

# What is the platform and language?

The application use the [Micronaut](https://micronaut.io/) platform and is written in Java. You build the application with [Gradle](https://gradle.org/).

# How do I make it go?

Run `./gradew run` in your shell.

You do not need to install Gradle because the `./gradlew` command will do that for you the first time.

# How do I access it?

You can do `curl http://localhost:8080/hello` and get back the response above.

# What if it doesn't go?

...
