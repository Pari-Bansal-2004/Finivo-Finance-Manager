import { Html, Head, Body, Preview, Container, Heading, Text, Section } from "react-email";
import * as React from "react";

export default function EmailTemplate({
    userName = "",
    type = "monthly-report",
    data = {},
}) {
    if(type === "monthly-report"){
         return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={Styles.body}>
          <Container style={Styles.container}>
            <Heading style={Styles.title}>Monthly Financial Report</Heading>

            <Text style={Styles.text}>Hello {userName},</Text>
            <Text style={Styles.text}>
              Here&rsquo;s your financial summary for {(data as {month?: string})?.month}:
            </Text>

            {/* Main Stats */}
            <Section style={Styles.statsContainer}>
              <div style={Styles.stat}>
                <Text style={Styles.text}>Total Income</Text>
                <Text style={Styles.heading}>${(data as {stats?: {totalIncome?: number}})?.stats?.totalIncome}</Text>
              </div>
              <div style={Styles.stat}>
                <Text style={Styles.text}>Total Expenses</Text>
                <Text style={Styles.heading}>${(data as {stats?: {totalExpenses?: number}})?.stats?.totalExpenses}</Text>
              </div>
              <div style={Styles.stat}>
                <Text style={Styles.text}>Net</Text>
                <Text style={Styles.heading}>
                  ${((data as {stats?: {totalIncome?: number, totalExpenses?: number}})?.stats?.totalIncome ?? 0) - ((data as {stats?: {totalIncome?: number, totalExpenses?: number}})?.stats?.totalExpenses ?? 0)}
                </Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {(data as { stats?: { byCategory?: Record<string, number> } })?.stats?.byCategory && (
              <Section style={Styles.section}>
                <Heading style={Styles.heading}>Expenses by Category</Heading>
                {Object.entries((data as { stats?: { byCategory?: Record<string, number> } })?.stats?.byCategory ?? {}).map(
                  ([category, amount]) => (
                    <div key={category} style={Styles.row}>
                      <Text style={Styles.text}>{category}</Text>
                      <Text style={Styles.text}>${amount}</Text>
                    </div>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {(data as { insights?: string[] })?.insights && (
              <Section style={Styles.section}>
                <Heading style={Styles.heading}>Welth Insights</Heading>
                {(data as { insights?: string[] })?.insights?.map((insight, index) => (
                  <Text key={index} style={Styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

          </Container>
        </Body>
      </Html>
    );
    }
    if(type === "budget-alert"){
        return (
            <Html>
                <Head />
                <Preview>Budget Alert</Preview>
                <Body style={Styles.body}>
                    <Container style={Styles.container}>
                        <Heading style={Styles.title}>Budget Alert</Heading>
                        <Text style={Styles.text}>Hello {userName},</Text>
                        <Text>
                            You&rsquo;ve used {(data as {percentageUsed?: number})?.percentageUsed?.toFixed(1)}% of your
              monthly budget.
                        </Text>
                        <Section style={Styles.statsContainer}>
                            <div style={Styles.stat}>
                                <Text style={Styles.text}>Budget Amount</Text>
                                <Text style={Styles.heading}>${(data as {budgetAmount?: number})?.budgetAmount}</Text>
                            </div>
                            <div style={Styles.stat}>
                                <Text style={Styles.text}>Spent So Far</Text>
                                <Text style={Styles.heading}>${(data as {totalExpenses?: number})?.totalExpenses}</Text>
                            </div>
                            <div style={Styles.stat}>
                                <Text style={Styles.text}>Remaining</Text>
                                <Text style={Styles.heading}>${((data as {budgetAmount?: number})?.budgetAmount || 0) - ((data as {totalExpenses?: number})?.totalExpenses || 0)}</Text>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Html>
        );    
    }
}

const Styles: Record<string, React.CSSProperties> = {
    body: {
        backgroundColor: "#f9fafb",
        fontFamily: "-apple-system, sans-serif",
    },
    container: {
        backgroundColor: "#ffffff",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    title: {
        color: "#1f2937",
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center" as const,
        margin: "0 0 20px",
    },
    heading: {
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "600",
        margin: "0 0 16px",
    },
    text: {
        color: "#4b5563",
        fontSize: "16px",
        margin: "0 0 16px",
    },
    statsContainer: {
        margin: "32px 0",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "5px",
    },
    stat: {
        marginBottom: "16px",
        padding: "12px",
        borderRadius: "4px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    section:{
        marginTop:"32px",
        padding:"20px",
        backgroundColor:"#f9fafb",
        borderRadius:"5px",
        border:"1px solid #e5e7eb",
    },
    row:{
        display:"flex",
        justifyContent:"space-between",
        padding:"12px 0",
        borderBottom:"1px solid #e5e7eb",
    }
};
