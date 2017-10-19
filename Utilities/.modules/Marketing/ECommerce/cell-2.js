%%
dot

digraph
apply
{
    label = 'High level architecture'
    rankdir = LR;
    fontname = Helvetica
    node[fontname = Helvetica, width = 1.8, height = 0.8]
    edge[fontname = Helvetica, fontsize = 12, fontcolor = blue, labeldistance = 1.8]

    subgraph
    cluster_available_plans
    {
        label = 'ECommerce.Core'

        subgraph
        cluster_available_plans
        {
            label = 'ECommerce.Entitlement'

            subgraph
            cluster_available_plans
            {
                label = 'ECommerce.Identity'

                integrations[shape = box, label = 'ECommerce.Integrations']
                myact[shape = box, label = 'ECommerce.MyAct']
            }
        }
    }

}