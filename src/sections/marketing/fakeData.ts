import {sha256} from "viem";

import { StrategyType, CampaignType, CampaignStatusTypes, CampaignCategoryType, CampaignCategories } from '@src/types/marketing';

const getRandomStatus = () => {
  const statuses = CampaignStatusTypes.map(status => status.value);
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getRandomBudget = () => Math.floor(Math.random() * 10000) + 1000;

const getRandomDate = (start: Date, end: Date) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  return date.toISOString().split('T')[0];
};

const getRandomCategoryType = (): CampaignCategoryType => {
  const categories = CampaignCategories.map(category => category.value) as CampaignCategoryType[];
  return categories[Math.floor(Math.random() * categories.length)];
};

const getRandomCampaign = (id: string): CampaignType => <CampaignType>({
  id,
  name: getRandomCampaignName(),
  status: getRandomStatus(),
  startDate: getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31)),
  endDate: getRandomDate(new Date(2025, 0, 1), new Date(2025, 11, 31)),
  access: String(Math.floor(Math.random() * 1000)),
  budget: String(getRandomBudget()),
  available: String(getRandomBudget()),
  type: getRandomCategoryType(),
  perUser: String(Math.floor(Math.random() * 100)),
});

export const generateRandomData = (items: number): StrategyType[] => {
  const total = getRandomBudget();
  const percentToSubstract = Math.floor(Math.random() * 100);
  const substract: number = total - (total * percentToSubstract) / 100;
  const data: StrategyType[] = [];
  for (let i = 0; i < items; i++) {
    data.push({
      id: `${ sha256(`0x${i}`)}`,
      name: `This is a cool and new strategy ${i + 1}`,
      status: getRandomStatus(),
      budget: total,
      available: Number(parseFloat(String(total - substract)).toFixed(0)),
      campaigns: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, index) => getRandomCampaign(`${ sha256(`0x${index}`)}`))
    });
  }
  return data;
};

const CampaignNames = [
  'Access for premium users',
  'Free trial for 30 days',
  'Discount for new users',
  'Free access for 1 year',
  'Free access for 6 months',
  'Free access for 3 months',
  'Discount for 1 year',
  ]

const getRandomCampaignName = (): string => {
  return CampaignNames[Math.floor(Math.random() * CampaignNames.length)];
}
