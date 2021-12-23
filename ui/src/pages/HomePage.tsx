import Content from "../components/organism/Content"
import PageTitle from "../components/organism/PageTitle"
import CardContent from "../components/organism/CardContent"
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

function HomePage(): JSX.Element {
    const history = useHistory()
    history.push("/pipelines")
    return (
        <Content>
            <PageTitle title="Kyaa Flow" subtitle="Welcome" />
            <CardContent>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            </CardContent>
            <CardContent>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat asperiores aspernatur eum, accusamus placeat odit sint eveniet deserunt amet esse cum cupiditate consectetur animi autem et dolore laudantium, voluptatum tempora?
            </CardContent>
        </Content>
    );
}

export default HomePage;
