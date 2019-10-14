import { Page, Card, SkeletonDisplayText, Select, Form, FormLayout, Layout, TextField } from '@shopify/polaris';
import firebase from './../firebase.js';
import '../style/settings.css';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authorization: '',
            organization_id: '',
            parcel_template: 'small',
            sending_method: 'parcel_locker'
        }
    }

    writeUserData = () => {;
        let shopId = this.state.shopId;
        if(shopId) {
            firebase.database().ref('shops/' + shopId).set({
                authorization: this.state.authorization,
                organization_id: this.state.organization_id,
                parcel_template: this.state.parcel_template,
                sending_method: this.state.sending_method
            });
            console.log('DATA SAVED');
        }
    }

    getUserData = (shopId) => {
        let ref = firebase.database().ref('shops/' + shopId);
        ref.on('value', snapshot => {
            const state = snapshot.val();
            this.setState({
                authorization: state.authorization,
                organization_id: state.organization_id,
                parcel_template: state.parcel_template,
                sending_method: state.sending_method,
                shopId: shopId
            });
        });
        console.log('DATA RETRIEVED');
    }

    handleChangeAuthorization = (newValue) => {
        this.setState({ authorization: newValue });
    }
    handleChangeOrganizationId = (newValue) => {
        this.setState({ organization_id: newValue });
    }
    handleChangeParcelTemplate = (newValue) => {
        this.setState({ parcel_template: newValue });
    }
    handleChangeSendingMethod = (newValue) => {
        this.setState({ sending_method: newValue });
    }

    render() {
        const { authorization, organization_id, parcel_template, sending_method, shopId } = this.state;
        const optionsParcelTemplate = [
            {label: 'A', value: 'small'},
            {label: 'B', value: 'medium'},
            {label: 'C', value: 'large'},
        ];
        const optionsSendingMethod = [
            {label: 'Nadam przesyłkę w Paczkomacie', value: 'parcel_locker'},
            {label: 'Nadam przesyłkę w Punkcie Obsługi Klienta (pok)', value: 'pok'},
            {label: 'Nadam przesyłkę w Punkcie Obsługi Klienta (courier pok)', value: 'courier_pok'},
            {label: 'Dostarczę przesyłkę do Oddziału InPost', value: 'branch'},
            {label: 'Utworzę zelecenie odbioru - przesyłkę odbierze Kurier InPost', value: 'dispatch_order'},
            {label: 'Nadam przesyłkę w Punkcie Obsługi Przesyłek', value: 'pop'},
        ]
        return (
            <Page fullWidth title="Store settings">                
                <Layout>
                    <Layout.AnnotatedSection
                        title="Store details"
                        description="Shopify and your customers will use this information to contact you."
                    >
                        {
                            !shopId &&
                            <Card sectioned>
                                <FormLayout>
                                    <div>
                                        <label>Authorization</label>
                                        <SkeletonDisplayText />
                                    </div>
                                    <div>
                                        <label>Organization Id</label>
                                        <SkeletonDisplayText />
                                    </div>
                                    <div>
                                        <label>Parcel Template</label>
                                        <SkeletonDisplayText />
                                    </div>
                                    <div>
                                        <label>Sending method</label>
                                        <SkeletonDisplayText />
                                    </div>
                                </FormLayout>
                            </Card>
                        }
                        {
                            shopId &&
                            <Card sectioned>                            
                                <Form>
                                    <FormLayout>
                                        <TextField name="authorization" value={authorization} onChange={this.handleChangeAuthorization} label="Authorization" />
                                        <TextField name="organization_id" value={organization_id} onChange={this.handleChangeOrganizationId} label="Organization Id" />
                                        <Select
                                            name="parcel_template"
                                            value={parcel_template}
                                            onChange={this.handleChangeParcelTemplate}                                        
                                            options={optionsParcelTemplate}
                                            label="Parcel Template"
                                        />
                                        <Select
                                            name="sending_method"
                                            value={sending_method}
                                            onChange={this.handleChangeSendingMethod}                                        
                                            options={optionsSendingMethod}
                                            label="Sending method"
                                        />
                                    </FormLayout>
                                </Form>
                            </Card>
                        }                            
                    </Layout.AnnotatedSection>                    
                </Layout>                
            </Page>
        )
    }

    async componentDidMount() {
        const query = `
            query {
                shop {
                id
                }
            }
        `;

        const url = "/graphql";
        const opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        };
        const response = await fetch(url, opts);
        const json = await response.json();

        this.getUserData(json.data.shop.id);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state) {
            this.writeUserData();
        }
    }

}

export default Settings;