%%
dot

digraph
apply
{
    label = 'Purchase funnel flow'
    rankdir = TB;
    fontname = Helvetica
    node[fontname = Helvetica, width = 1.8, height = 0.8]
    edge[fontname = Helvetica, fontsize = 12, fontcolor = blue, labeldistance = 1.8]

    subgraph
    cluster_landing_site
    {
        label = 'Landing Site'
        start [href = 'Good%20UX%20Intro.ipynb#Layout', shape = box, style = rounded, label = 'Customer lands\non act.com']
        {
            rank = same
            hasaccount[shape = 'diamond', label = 'Has an account?'];
            upgrade[shape = 'diamond', label = 'Offer upgrade'];
        }

        highlight[shape = 'box', label = 'Highlight best\nsales options'];


        start:s -> hasaccount
    :
        n
        hasaccount:e -> upgrade
    :
        w[label = 'Yes']
        hasaccount:s -> highlight
    :
        n[label = 'No']
    }

    subgraph
    cluster_trial_flow
    {
        label = 'Trial Flow'
        rankdir = TB;
        rank = same

        trialemail[shape = 'box', style = 'rounded', label = 'Send trial invite']
        trialinfo[shape = 'box', label = 'Collect trial\ncustomer info']
        trial[shape = 'diamond', label = 'Subscribe to trial?'];

        highlight -> trial
        trial -> trialinfo[label = 'Yes']
        trialinfo -> trialemail
    }

    subgraph
    cluster_purchase_funnel
    {
        label = 'Purchase Funnel'

        upgrade:s -> funnel
    :
        n
        trial:e -> funnel
    :
        n[label = 'No']

        funnel[shape = 'box', label = 'Purchase funnel'];
        subscribe [shape = box, label = 'Subscribe']
        review [shape = box, label = 'Review Selection']
        hasaccount2 [shape = diamond, label = 'Has An Account?']
        skiptobilling [shape = box, label = 'Skip To Billing']
        setupaccount [shape = box, label = 'Set Up Account']

        funnel -> subscribe
        subscribe -> review
        review -> hasaccount2
        hasaccount2 -> setupaccount [label = 'No']
        hasaccount2 -> skiptobilling [label = 'Yes']
    }

    subgraph
    cluster_billing
    {
        label = 'Billing'

        setupaccount -> billing
        skiptobilling -> billing

        billing [shape = 'box', label = 'Billing']
        {
            rank = same;
            hasaccount3 [shape = diamond, label = 'Has an account?']
            autofill [shape = box, label = 'Auto-fill Zuora\nAccount Info']
        }
        collectpayment [shape = box, label = 'Collect Payment Info']
        confirm [shape = box, label = 'Confirmation']
        thanksemail [shape = box, style = rounded, label = 'Send Thank\nYou Email']

        billing -> hasaccount3
        hasaccount3 -> autofill [label = 'Yes']
        autofill -> collectpayment
        hasaccount3 -> collectpayment [label = 'No']
        collectpayment -> confirm
        confirm -> thanksemail
    }

}