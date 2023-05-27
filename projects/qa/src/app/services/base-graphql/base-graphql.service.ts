import { Apollo, gql } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { onError } from '@apollo/client/link/error';
import { Injector } from '@angular/core';
import { InMemoryCache, ApolloLink, DefaultOptions } from '@apollo/client/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

export class BaseGraphQLService {

    apollo: Apollo;
    httpLink: HttpLink;
    toastrService: ToastrService;

    constructor(protected injector: Injector) {
        this.apollo = this.injector.get(Apollo);
        this.httpLink = this.injector.get(HttpLink);
        this.toastrService = this.injector.get(ToastrService);
    }

    /**
    * Create Apollo client
    */
    createClient(name: string, urlInput?: string): void {
        if (!this.apollo.use(name)) {//check if client not already created
            const url = (urlInput || `${environment.gatewayUrl}/${name}/graphql`)
            const defaultOptions: DefaultOptions = {
                watchQuery: {

                    // fetchPolicy: 'network-only',

                    fetchPolicy: 'no-cache',

                    errorPolicy: 'all'

                },

                query: {

                    // fetchPolicy: 'network-only',

                    fetchPolicy: 'no-cache',

                    errorPolicy: 'all'

                }

            }


            const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {

                let currentError: Error;
                if (graphQLErrors) {
                    graphQLErrors.map(({ message, locations, path }) => {
                        currentError = new Error(`[API GraphQL error]: ${message}`);
                        this.handleError(currentError, 'notification');
                        return forward(operation);
                    });
                }

                if (networkError) {
                    currentError = new Error(`[API Network error]: ${(networkError && networkError['error'] && networkError['error'].error_description) || networkError.message}`);

                    currentError['networkError'] = networkError;
                    this.handleError(currentError, 'notification');
                    return forward(operation);

                }
                return forward(operation);


            });

            let headers = new HttpHeaders({
                Accept: 'application/json',
                'Content-Type': 'application/json'
            });

            const httpLink = this.httpLink.create({ uri: url, headers: headers });

            this.apollo.createNamed(name, {
                link: ApolloLink.from([
                    errorLink,
                    httpLink
                ]),
                cache: new InMemoryCache({
                    addTypename: false
                }),
                defaultOptions
            });
        }
    }

    /**
     * Handle single error
     */
    handleError(error: Error, type: string): void {
        const message = this.getClientMessage(error);
        const stackTrace = this.getClientStackTrace(error);
        switch (type) {
            case 'throw':
                throw error;
            case 'notification': {
                const toastOptions = {
                    enableHtml: true,
                    closeButton: true,
                    progressBar: false,
                    tapToDismiss: false,
                    disableTimeOut: true,
                    enableBootstrap: true,
                    positionClass: 'toast-top-full-width'
                };
                this.toastrService.error(message, null, toastOptions);
                console.error(`${message} \n ${stackTrace}`);
                break;
            }
            case 'console':
                console.error(`${message} \n ${stackTrace}`);
                break;
        }
    }


    getClientMessage(error: Error): string {
        return error.message ? error.message : error.toString();
    }

    /**
     * Get client error stack trace
     * @param error
     */
    getClientStackTrace(error: Error): string | undefined {
        return error.stack;
    }
    /**
     * Make request
     */
    request(clientName: string, query: string, variables: any = {}) {

        // Query
        if (query.indexOf('query') >= 0) {
            return this.apollo.use(clientName).query({
                query: gql`${query}`,
                variables
            });

        } else {
            return this.apollo.use(clientName).mutate({
                mutation: gql`${query}`,
                variables
            });
        }
    }

}
